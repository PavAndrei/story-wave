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

export type Post = {
  authorId: string;
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  categories: string[];
  coverImgUrl: string;
  imagesUrls: string[];
  isDeleted: boolean;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: 0;
};

export type Session = {
  _id: string;
  createdAt: string;
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

export type CreatePostApiResponse = ApiResponse & {
  data?: Post;
};
export type EditPostApiResponse = ApiResponse & {
  data?: Post;
};

export type GetSinglePostApiResponse = ApiResponse & {
  data?: Post;
};

export type UploadApiResponse = ApiResponse & {
  data?: string[];
};

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

export const postApi = {
  baseKey: "post",
  createPost: (data: FormData) => {
    return apiInstance<CreatePostApiResponse>(`/post`, {
      method: "POST",
      body: data,
      credentials: "include",
    });
  },
  editPost: (data: { formData: FormData; id: string }) => {
    return apiInstance<EditPostApiResponse>(`/post/${data.id}`, {
      method: "PATCH",
      body: data.formData,
      credentials: "include",
    });
  },
  getSinglePost: (id: string) => {
    return apiInstance<GetSinglePostApiResponse>(`/post/${id}`, {
      method: "GET",
      credentials: "include",
    });
  },
};

// export const uploadApi = {
//   baseKey: "upload",
//   uploadImages: (files: File[]) => {
//     const formData = new FormData();
//     files.forEach((file) => {
//       formData.append("images", file);
//     });
//     return apiInstance<UploadApiResponse>(`/upload/images`, {
//       method: "POST",
//       body: formData,
//       credentials: "include",
//     });
//   },
// };

export const uploadApi = {
  baseKey: "upload",
  uploadImages: (formData: FormData) => {
    return apiInstance<UploadApiResponse>(`/upload/images`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  },
};
