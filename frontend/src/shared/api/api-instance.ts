import { CONFIG } from "../model/config";

export type ApiErrorResponse = {
  message: string;
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

export const apiInstance = async <T>(
  url: string,
  init?: RequestInit & { json?: unknown },
) => {
  let headers = init?.headers ?? {};

  if (init?.json) {
    headers = {
      "Content-Type": "application/json",
      ...headers,
    };

    init.body = JSON.stringify(init.json);
  }

  const response = await fetch(`${CONFIG.API_BASE_URL}${url}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let errorBody: ApiErrorResponse | undefined;

    try {
      errorBody = await response.json();
    } catch {
      errorBody = { message: "Unknown error" };
    }

    const message =
      errorBody?.message || `Request failed with status ${response.status}`;

    throw new ApiError(response.status, message, errorBody);
  }

  const data = (await response.json()) as T;
  return data;
};
