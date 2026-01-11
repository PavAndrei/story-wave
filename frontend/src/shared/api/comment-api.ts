import { buildQueryString } from "../model/url-params";
import { apiInstance } from "./api-instance";

import type {
  CreateCommentApiResponse,
  CreateCommentPayload,
  GetCommentsApiResponse,
  GetCommentApiResponse,
} from "./api-types";

export const commentApi = {
  baseKey: "comment",

  createComment: (data: CreateCommentPayload) => {
    return apiInstance<CreateCommentApiResponse>(`/comment`, {
      method: "POST",
      json: data,
      credentials: "include",
    });
  },

  getPublicComments: ({
    blogId,
    page,
    limit,
  }: {
    blogId: string;
    page: number;
    limit: number;
  }) => {
    const query = buildQueryString({
      page: String(page),
      limit: String(limit),
    });
    return apiInstance<GetCommentsApiResponse>(`/comment/${blogId}${query}`, {
      method: "GET",
    });
  },

  deleteComment: (commentId: string) => {
    return apiInstance(`/comment/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });
  },

  editComment: (commentId: string, data: { content: string }) => {
    return apiInstance<GetCommentApiResponse>(`/comment/${commentId}`, {
      method: "PATCH",
      credentials: "include",
      json: data,
    });
  },
};
