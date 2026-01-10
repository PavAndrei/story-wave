import { useMutation } from "@tanstack/react-query";
import { commentApi } from "@/shared/api/comment-api";
import { queryClient } from "@/shared/api/query-client";
import type { CreateCommentPayload } from "@/shared/api/api-types";

export const useCreateComment = () => {
  const mutation = useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentApi.createComment(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [commentApi.baseKey, "blog", variables.blogId],
      });
    },
  });

  return {
    createComment: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};
