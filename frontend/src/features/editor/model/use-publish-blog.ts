import type { BlogDTO } from "@/shared/api/api-types";
import { blogApi } from "@/shared/api/blog-api";
import { queryClient } from "@/shared/api/query-client";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { href, useNavigate } from "react-router-dom";

type PublishBlogResponse = {
  blog: BlogDTO;
};

export const usePublishBlog = () => {
  const navigate = useNavigate();

  const mutation = useMutation<PublishBlogResponse, Error, BlogParams>({
    mutationFn: blogApi.saveBlog,

    onSuccess: (data) => {
      navigate(href(ROUTES.BLOG, { blogId: data.blog._id }));
      queryClient.invalidateQueries({ queryKey: [blogApi.baseKey] });
    },

    onError: (error) => {
      console.error("Failed to publish blog:", error);
    },
  });

  const publishBlog = async (payload: BlogParams) => {
    const result = await mutation.mutateAsync(payload);
    return result.blog;
  };

  const errorMessage = mutation.isError ? mutation.error.message : undefined;

  return {
    publishBlog,
    isPending: mutation.isPending,
    errorMessage,
  };
};
