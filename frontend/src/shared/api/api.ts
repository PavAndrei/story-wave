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

export type SessionItem = {
  _id: string;
  createdAt: Date;
};

export type SessionApiResponse = {
  success: boolean;
  message: string;
  sessions: SessionItem[];
};

export type LogoutApiResponse = {
  success: boolean;
  message: string;
};

export type VerifyEmailApiResponse = {
  success: boolean;
  message: string;
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
  logout: () => {
    return apiInstance<LogoutApiResponse>(`/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
  },
  refresh: () => {},
  verifyEmailCode: (code: string) => {
    return apiInstance<VerifyEmailApiResponse>(`/auth/email/verify/${code}`, {
      method: "GET",
    });
  },
  forgotPassword: () => {},
  resetPassword: () => {},
};

export const sessionApi = {
  baseKey: "session",
  getSession: () => {
    return apiInstance<SessionApiResponse>(`/session`, {
      method: "GET",
      credentials: "include",
    });
  },
  deleteSession: (id: string) => {
    return apiInstance(`/session/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};

export const userApi = {
  baseKey: "user",
  getProfile: () => {},
};
