import { buildQueryString } from "../model/url-params";
import { apiInstance } from "./api-instance";
import type {
  ApiResponse,
  ApiResponseWithBlogData,
  ApiResponseWithBlogsAndPagination,
  ApiResponseWithMultipleBlogData,
  BlogsPagination,
  MyBlogsFilters,
  PublicBlogsFilters,
  SaveBlogPayload,
  ToggleFavoriteBlogApiResponse,
  ToggleLikeApiResponse,
} from "./api-types";

export const blogApi = {
  baseKey: "blog",

  saveBlog: (data: SaveBlogPayload) => {
    return apiInstance<ApiResponseWithBlogData>("/blog", {
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

    return apiInstance<ApiResponseWithMultipleBlogData>(`/blog/my${query}`, {
      method: "GET",
      credentials: "include",
    });
  },

  getAllBlogs: (filters: PublicBlogsFilters) => {
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

    return apiInstance<ApiResponseWithBlogsAndPagination>(
      `/blog/public${query}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  },

  getFavoriteBlogs: (filters: Pick<BlogsPagination, "page" | "limit">) => {
    const query = buildQueryString({
      page: String(filters.page),
      limit: String(filters.limit),
    });

    return apiInstance<ApiResponseWithBlogsAndPagination>(
      `/blog/favorites${query}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  },

  getRecentBlogs: (filters: Pick<BlogsPagination, "page" | "limit">) => {
    const query = buildQueryString({
      page: String(filters.page),
      limit: String(filters.limit),
    });

    return apiInstance<ApiResponseWithBlogsAndPagination>(
      `/blog/recent${query}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  },

  getTopBlogs: () => {
    return apiInstance<ApiResponseWithMultipleBlogData>(`/blog/top`, {
      method: "GET",
    });
  },

  getBlogById: (id: string) => {
    return apiInstance<ApiResponseWithBlogData>(`/blog/${id}`, {
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

  toggleFavorite: (blogId: string) => {
    return apiInstance<ToggleFavoriteBlogApiResponse>(
      `/blog/${blogId}/favorite`,
      {
        method: "POST",
        credentials: "include",
      },
    );
  },

  addToRecentBlogs: (blogId: string) => {
    return apiInstance<ApiResponse>(`/blog/${blogId}/recent`, {
      method: "POST",
      credentials: "include",
    });
  },
};
