import { CONFIG } from "../model/config";

export type ApiErrorResponse = {
  message: string;
  success?: boolean;
  error?: string;
  errorCode?: string;
};

class ApiError extends Error {
  public status: number;
  public data?: ApiErrorResponse;

  constructor(status: number, message: string, data?: ApiErrorResponse) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// Флаги для единственного refresh-потока
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

const doRefresh = async (): Promise<void> => {
  // если уже идёт рефреш — дождаться его
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        // пробрасываем ApiError с телом, чтобы вызывающий понял причину
        const body = await res
          .json()
          .catch(() => ({ message: "Refresh failed" }));
        throw new ApiError(res.status, body.message || "Refresh failed", body);
      }

      // удачный refresh — можем прочитать тело (если нужно)
      await res.json().catch(() => undefined);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const apiInstance = async <T>(
  url: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> => {
  let headers = init?.headers ?? {};

  // если передали json — сериализуем
  if (init?.json) {
    headers = {
      "Content-Type": "application/json",
      ...headers,
    };
    init.body = JSON.stringify(init.json);
  }

  // по умолчанию включаем credentials, если не указанно
  const credentials = init?.credentials ?? "include";

  const doFetch = () =>
    fetch(`${CONFIG.API_BASE_URL}${url}`, {
      ...init,
      headers,
      credentials,
    });

  // Выполняем запрос
  let response = await doFetch();

  // Если всё ок — возвращаем распарсенный json
  if (response.ok) {
    return response.json();
  }

  // Попытаться распарсить тело ошибки
  const errorBody: ApiErrorResponse = await response.json().catch(() => ({
    message: "Unknown error",
  }));

  // Когда access протух — триггерим refresh (но не для самого refresh-эндоинта)
  if (
    response.status === 401 &&
    errorBody?.errorCode === "invalidAccessToken" &&
    !url.endsWith("/auth/refresh")
  ) {
    try {
      // Выполняем единичный рефреш (параллельные запросы будут ждать)
      await doRefresh();
    } catch (refreshErr) {
      // Refresh провалился — пробрасываем ошибку дальше
      if (refreshErr instanceof ApiError) throw refreshErr;
      throw new ApiError(500, "Refresh failed", { message: "Refresh failed" });
    }

    // Повторяем исходный запрос после успешного refresh
    response = await doFetch();

    if (response.ok) {
      return response.json();
    }

    const retryErrBody: ApiErrorResponse = await response.json().catch(() => ({
      message: "Unknown error on retry",
    }));
    throw new ApiError(response.status, retryErrBody.message, retryErrBody);
  }

  // В остальных случаях — обычная ошибка
  throw new ApiError(response.status, errorBody.message, errorBody);
};
