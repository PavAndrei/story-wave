import { apiInstance } from "@/shared/api/api-instance";

export type ApiResponse = {
  success?: boolean;
  message: string;
  error?: string;
  errorCode?: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  verified: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type Blog = {
  _id: string;
  authorId: string;
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  categories: string[];
  coverImgUrl: string;
  imagesUrls: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};
export type Session = {
  _id: string;
  createdAt: string;
};

export type ImageUrl = {
  id: string;
  url: string;
};

export type RegistrationApiResponse = ApiResponse & {
  data?: User;
};

export type LoginApiResponse = ApiResponse & {
  data?: User;
};

export type VerifyEmailApiResponse = ApiResponse & {
  data?: User;
};

export type GetSessionApiResponse = ApiResponse & {
  data?: Session[];
};

export type GetMyProfileApiResponse = ApiResponse & {
  data?: User;
};

export type EditMyProfileApiResponse = ApiResponse & {
  data?: User;
};
export type CreateDraftBlogApiResponse = ApiResponse & { blog: Blog };

export type UploadApiResponse = ApiResponse & { data?: ImageUrl[] };

export const authApi = {
  baseKey: "auth",
  login: (data: { email: string; password: string }) => {
    return apiInstance<LoginApiResponse>(`/auth/login`, {
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
    return apiInstance<RegistrationApiResponse>(`/auth/register`, {
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
    return apiInstance<VerifyEmailApiResponse>(`/auth/email/verify/${code}`, {
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

export const sessionApi = {
  baseKey: "session",
  getSession: () => {
    return apiInstance<GetSessionApiResponse>(`/session`, {
      method: "GET",
      credentials: "include",
    });
  },
};

export const userApi = {
  baseKey: "user",
  getMyProfile: () => {
    return apiInstance<GetMyProfileApiResponse>(`/user/me`, {
      method: "GET",
      credentials: "include",
    });
  },
  editMyProfile: (data: { id: string; payloadData: FormData }) => {
    return apiInstance<EditMyProfileApiResponse>(`/user/me/${data.id}`, {
      method: "PATCH",
      body: data.payloadData,
      credentials: "include",
    });
  },
  deleteMyProfile: () => {
    return apiInstance<ApiResponse>(`/user/me`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};

export type BlogParams = {
  status: "draft" | "published";
  data?: {
    title?: string;
    content?: string;
    categories?: string[];
    coverImgUrl?: string;
    images?: string[];
  };
};

export const blogApi = {
  baseKey: "blog",

  createDraft: (data: BlogParams) => {
    return apiInstance<CreateDraftBlogApiResponse>("/blog/draft", {
      method: "POST",
      json: data,
      credentials: "include",
    });
  },
};

export const uploadApi = {
  baseKey: "upload",

  uploadImages: (postId: string, formData: FormData) => {
    return apiInstance<UploadApiResponse>(`/upload/images/${postId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  },

  deleteImage: (imageId: string) => {
    return apiInstance<ApiResponse>(`/upload/images/${imageId}`, {
      method: "DELETE",
      credentials: "include",
    });
  },
};
