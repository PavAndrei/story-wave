import { useMutation } from "@tanstack/react-query";
import { blogApi, type BlogParams } from "@/shared/api/api";
import { href, useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";

export const usePublishBlog = () => {
  const navigate = useNavigate();

  const publishBlogMutation = useMutation({
    mutationFn: (data: BlogParams) => blogApi.createBlog(data),

    onSuccess: (data) => {
      console.log("CREATE DRAFT SUCCESS:", data);
      navigate(href(ROUTES.BLOG, { blogId: data.blog._id }));
    },

    onError: (error) => {
      console.error("CREATE DRAFT FAILED:", error.message);
    },
  });

  const errorMessage = publishBlogMutation.isError
    ? publishBlogMutation.error.message
    : null;

  return {
    publishBlog: (data: BlogParams) => publishBlogMutation.mutate(data),
    isPending: publishBlogMutation.isPending,
    errorMessage,
  };
};
