import type { CommentDTO } from "@/shared/api/api-types";
import { commentApi } from "@/shared/api/comment-api";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { startTransition, useOptimistic } from "react";

type OptimisticLikeState = {
  isLiked: boolean;
  likesCount: number;
};

export const useToggleLike = () => {
  const [optimistic, setOptimistic] = useOptimistic<
    Record<string, OptimisticLikeState>
  >({});

  const toggleLikeMutation = useMutation({
    mutationFn: (commentId: string) => commentApi.toggleLike(commentId),

    onSettled: async () => {
      // сервер → источник истины
      await queryClient.invalidateQueries({
        queryKey: [commentApi.baseKey],
      });
    },
  });

  const toggle = (comment: CommentDTO) => {
    startTransition(async () => {
      const current = optimistic[comment._id] ?? {
        isLiked: Boolean(comment.isLiked ?? false),
        likesCount: Number(comment.likesCount),
      };

      const next: OptimisticLikeState = {
        isLiked: !current.isLiked,
        likesCount: current.isLiked
          ? current.likesCount - 1
          : current.likesCount + 1,
      };

      // 🔥 важно: optimistic всегда источник истины
      setOptimistic((prev) => ({
        ...prev,
        [comment._id]: next,
      }));

      await toggleLikeMutation.mutateAsync(comment._id);
    });
  };

  const getLikeState = (comment: CommentDTO): OptimisticLikeState => {
    return (
      optimistic[comment._id] ?? {
        isLiked: comment.isLiked ?? false,
        likesCount: comment.likesCount,
      }
    );
  };

  return {
    toggle,
    getLikeState,
    isPending: toggleLikeMutation.isPending,
  };
};
