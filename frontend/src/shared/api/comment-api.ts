import { buildQueryString } from "../model/url-params";
import { apiInstance } from "./api-instance";

import type { GetCommentsApiResponse } from "./api-types";

export const commentApi = {
  baseKey: "comment",

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
};
