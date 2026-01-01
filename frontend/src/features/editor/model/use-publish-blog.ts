import { blogApi, type Blog, type BlogParams } from "@/shared/api/api";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { href, useNavigate } from "react-router-dom";

type PublishBlogResponse = {
  blog: Blog;
};

export const usePublishBlog = () => {
  const navigate = useNavigate();

  const mutation = useMutation<PublishBlogResponse, Error, BlogParams>({
    mutationFn: blogApi.saveBlog,

    onSuccess: (data) => {
      navigate(href(ROUTES.BLOG, { blogId: data.blog._id }));
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
