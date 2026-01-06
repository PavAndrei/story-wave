// Common types

export type ApiResponse = {
  success?: boolean;
  message: string;
  error?: string;
  errorCode?: string;
};

// Blogs

export type BlogDTO = {
  _id: string;
  authorId: {
    _id: string;
    username: string;
  };
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  lastEditedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  categories: string[];
  coverImgUrl?: string;
  imagesUrls?: string[];
  viewsCount: number;
  likesCount: number;
  likedBy: string[];
  isFavorite?: boolean;
  isLiked?: boolean;
  __v: number;
};

export type RecentBlog = {
  _id: string;
  blogId: string;
  viewedAt: string;
};

export type BlogsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SaveBlogPayload = {
  blogId?: string;
  status: "draft" | "published";
  title?: string;
  content?: string;
  categories?: string[];
  coverImgUrl?: string | null;
};

export type BlogsFilters = {
  sort: "newest" | "oldest";
  search: string;
  categories: string[];

  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

export type MyBlogsFilters = BlogsFilters & {
  status?: "draft" | "published" | "archived";
};

export type PublicBlogsFilters = BlogsFilters & {
  author: string;
};

export type ApiResponseWithBlogData = ApiResponse & {
  blog?: BlogDTO;
};

export type ApiResponseWithMultipleBlogData = ApiResponse & {
  blogs?: BlogDTO[];
};

export type ApiResponseWithBlogsAndPagination = ApiResponse & {
  blogs?: BlogDTO[];
  pagination: BlogsPagination;
};

export type ToggleFavoriteBlogApiResponse = ApiResponse & {
  data?: { isFavorite: boolean };
};

// Users

export type UserDTO = {
  _id: string;
  username: string;
  email: string;
  verified: boolean;
  avatarUrl?: string;
  avatarPublicId?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  blogs: string[];
  favorites: string[];
  recentBlogs: RecentBlog[];
  __v: number;
};

export type ApiResponseWithUserData = ApiResponse & {
  user?: UserDTO;
};

export type ApiResponseWIthMultipleUserData = ApiResponse & {
  users?: UserDTO[];
};

// Likes

export type Like = {
  likesCount: number;
  isLiked: boolean;
};

export type ToggleLikeApiResponse = ApiResponse & {
  data?: Like;
};

// Sessions

export type Session = {
  _id: string;
  createdAt: string;
};

export type GetSessionApiResponse = ApiResponse & {
  data?: Session[];
};

// Uploads

export type ImageUrl = {
  id: string;
  url: string;
};

export type UploadApiResponse = ApiResponse & { data?: ImageUrl[] };
