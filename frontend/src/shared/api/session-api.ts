import { apiInstance } from "./api-instance";
import type { GetSessionApiResponse } from "./api-types";

export const sessionApi = {
  baseKey: "session",
  getSession: () => {
    return apiInstance<GetSessionApiResponse>(`/session`, {
      method: "GET",
      credentials: "include",
    });
  },
};
