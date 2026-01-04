import { blogApi } from "@/shared/api/api";
import type { PathParams, ROUTES } from "@/shared/model/routes";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export const useBlog = () => {
  const params = useParams<PathParams[typeof ROUTES.BLOG]>();

  const blogQuery = useQuery({
    queryKey: [blogApi.baseKey, "by-id", params.blogId],
    queryFn: () => blogApi.getBlogById(params.blogId!),
    enabled: !!params.blogId,
    select: (data) => data.blog,
  });

  return {
    blog: blogQuery.data,
    isLoading: blogQuery.isLoading,
    isError: blogQuery.isError,
  };
};
