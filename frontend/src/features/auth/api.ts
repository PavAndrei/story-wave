import { apiInstance } from "@/shared/api/api-instance";

export type AuthApiResponse = {
  success: boolean;
  message: string;
  data?: {
    username: string;
    email: string;
    verified: boolean;
    _id: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
  };
};

export const authApi = {
  baseKey: "auth",
  login: (data: { email: string; password: string }) => {
    return apiInstance<AuthApiResponse>(`/auth/login`, {
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
    return apiInstance<AuthApiResponse>(`/auth/register`, {
      method: "POST",
      json: data,
      credentials: "include",
    });
  },
  refresh: () => {},
  logout: () => {},
  verifyEmailCode: () => {},
  forgotPassword: () => {},
  resetPassword: () => {},
};
