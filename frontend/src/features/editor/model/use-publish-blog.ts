import { blogApi, type BlogParams } from "@/shared/api/api";
import { queryClient } from "@/shared/api/query-client";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { href, useNavigate } from "react-router-dom";

export const usePublishBlog = () => {
  const navigate = useNavigate();

  const publishBlogMutation = useMutation({
    mutationFn: (data: BlogParams) => blogApi.saveBlog(data),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      navigate(
        href(ROUTES.BLOG, {
          blogId: data.blog._id,
        }),
      );
    },

    onError: (error) => {
      console.error("PUBLISH FAILED:", error.message);
    },
  });

  return {
    publishBlog: publishBlogMutation.mutate,
    isPending: publishBlogMutation.isPending,
    errorMessage: publishBlogMutation.isError
      ? publishBlogMutation.error.message
      : null,
  };
};
