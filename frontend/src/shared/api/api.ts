import { apiInstance } from "@/shared/api/api-instance";
import { buildQueryString } from "../model/url-params";

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
  avatarPublicId?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export type Blog = {
  authorId: string | Partial<User>;
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  categories: string[];
  coverImgUrl: string;
  imagesUrls: string[];
  isDeleted: boolean;
  _id: string;
  createdAt: Date;
  lastEditedAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  __v: number;
  likesCount: number;
  likedBy: string[];
  isLiked?: boolean;
  viewsCount: number;
};

export type Like = {
  likesCount: number;
  isLiked: boolean;
};

export type MyBlogsFilters = {
  status: "draft" | "published" | "archived" | undefined;
  sort: "newest" | "oldest";
  search: string;
  categories: string[];

  page?: number;
  limit?: number;
};

export type BlogsFilters = {
  sort: "newest" | "oldest";
  search: string;
  author: string;
  categories: string[];

  page?: number;
  limit?: number;
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
export type CreateBlogApiResponse = ApiResponse & { blog: Blog };
export type GetBlogByIdApiResponse = ApiResponse & { blog: Blog };
export type GetMyBlogsApiResponse = ApiResponse & {
  blogs?: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetAllBlogsApiResponse = ApiResponse & {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ToggleLikeApiResponse = ApiResponse & {
  data?: Like;
};

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
  blogId?: string;
  status: "draft" | "published";
  title?: string;
  content?: string;
  categories?: string[];
  coverImgUrl?: string | null;
};

export const blogApi = {
  baseKey: "blog",

  saveBlog: (data: BlogParams) => {
    return apiInstance<CreateBlogApiResponse>("/blog", {
      method: "POST",
      json: data,
      credentials: "include",
    });
  },

  getMyBlogs: (filters: MyBlogsFilters) => {
    const query = buildQueryString({
      page: String(filters.page),
      limit: String(filters.limit),
      status: filters.status,
      sort: filters.sort,
      search: filters.search,
      categories:
        filters.categories.length > 0
          ? filters.categories.join(",")
          : undefined,
    });

    return apiInstance<GetMyBlogsApiResponse>(`/blog/my${query}`, {
      method: "GET",
      credentials: "include",
    });
  },

  getAllBlogs: (filters: BlogsFilters) => {
    const query = buildQueryString({
      page: String(filters.page),
      limit: String(filters.limit),
      sort: filters.sort,
      search: filters.search,
      author: filters.author,
      categories:
        filters.categories.length > 0
          ? filters.categories.join(",")
          : undefined,
    });

    return apiInstance<GetAllBlogsApiResponse>(`/blog/public${query}`, {
      method: "GET",
    });
  },

  getBlogById: (id: string) => {
    return apiInstance<GetBlogByIdApiResponse>(`/blog/${id}`, {
      method: "GET",
      credentials: "include",
    });
  },

  deleteBlogById: (id: string) => {
    return apiInstance<ApiResponse>(`/blog/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  },

  toggleLike: (blogId: string) => {
    return apiInstance<ToggleLikeApiResponse>(`/blog/${blogId}/like`, {
      method: "POST",
      credentials: "include",
    });
  },

  registerView: (blogId: string) => {
    return apiInstance<ApiResponse>(`/blog/${blogId}/view`, {
      method: "POST",
    });
  },
};

export const uploadApi = {
  baseKey: "upload",

  uploadImages: (blogId: string, formData: FormData) => {
    return apiInstance<UploadApiResponse>(`/upload/images/${blogId}`, {
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
