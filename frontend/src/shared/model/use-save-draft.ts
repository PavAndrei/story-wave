import { href, useNavigate } from "react-router-dom";
import { queryClient } from "../api/query-client";
import { blogApi, type BlogParams } from "../api/api";
import { useMutation } from "@tanstack/react-query";
import { ROUTES } from "./routes";

export const useSaveDraft = () => {
  const navigate = useNavigate();

  const saveDraftMutation = useMutation({
    mutationFn: (data: BlogParams) => blogApi.saveBlog(data),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      // если blogId не было — добавляем его в url
      if (!variables.blogId) {
        navigate(
          href(ROUTES.CREATE_BLOG, {
            blogId: data.blog._id,
          }),
          { replace: true },
        );
      }
    },

    onError: (error) => {
      console.error("SAVE DRAFT FAILED:", error.message);
    },
  });

  return {
    saveDraftFunction: saveDraftMutation.mutate,
    isPending: saveDraftMutation.isPending,
    errorMessage: saveDraftMutation.isError
      ? saveDraftMutation.error.message
      : null,
  };
};
