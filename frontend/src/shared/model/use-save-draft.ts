import { blogApi, type BlogParams } from "@/shared/api/api";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { href, useNavigate } from "react-router-dom";

export const useSaveDraft = () => {
  const navigate = useNavigate();

  const saveDraftMutation = useMutation({
    mutationFn: (data: BlogParams) => blogApi.createBlog(data),

    onSuccess: (data) => {
      console.log("CREATE DRAFT SUCCESS:", data);
      navigate(href(ROUTES.CREATE_BLOG, { blogId: data.blog._id }));
    },

    onError: (error) => {
      console.error("CREATE DRAFT FAILED:", error.message);
    },
  });

  const errorMessage = saveDraftMutation.isError
    ? saveDraftMutation.error.message
    : null;

  return {
    saveDraftFunction: saveDraftMutation.mutate,
    isPending: saveDraftMutation.isPending,
    errorMessage,
  };
};
