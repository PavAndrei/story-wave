import { apiInstance } from "./api-instance";
import type { ApiResponse, ApiResponseWithUserData } from "./api-types";

export const authApi = {
  baseKey: "auth",
  login: (data: { email: string; password: string }) => {
    return apiInstance<ApiResponseWithUserData>(`/auth/login`, {
      method: "POST",
      json: data,
      credentials: "include",
    });
  },
  register: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    return apiInstance<ApiResponse>(`/auth/register`, {
      method: "POST",
      json: data,
      credentials: "include",
    });
  },
  logout: () => {
    return apiInstance<ApiResponse>(`/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
  },
  verifyEmailCode: (code: string) => {
    return apiInstance<ApiResponseWithUserData>(`/auth/email/verify/${code}`, {
      method: "GET",
      credentials: "include",
    });
  },
  forgotPassword: (email: string) => {
    return apiInstance<ApiResponse>(`/auth/password/forgot`, {
      method: "POST",
      json: { email },
    });
  },
  resetPassword: (data: { password: string; verificationCode: string }) => {
    return apiInstance<ApiResponse>(`/auth/password/reset`, {
      method: "POST",
      json: data,
    });
  },
};
