import type { BlogDTO } from "@/shared/api/api-types";
import { blogApi } from "@/shared/api/blog-api";
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
    mutationFn: (blogId: string) => blogApi.toggleLike(blogId),

    onSettled: async (_data, _error, blogId) => {
      // сервер → источник истины
      await queryClient.invalidateQueries({
        queryKey: [blogApi.baseKey, "by-id", blogId],
      });
    },
  });

  const toggle = (blog: BlogDTO) => {
    startTransition(async () => {
      const current = optimistic[blog._id] ?? {
        isLiked: blog.isLiked ?? false,
        likesCount: blog.likesCount,
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
        [blog._id]: next,
      }));

      await toggleLikeMutation.mutateAsync(blog._id);
    });
  };

  const getLikeState = (blog: BlogDTO): OptimisticLikeState => {
    return (
      optimistic[blog._id] ?? {
        isLiked: blog.isLiked ?? false,
        likesCount: blog.likesCount,
      }
    );
  };

  return {
    toggle,
    getLikeState,
    isPending: toggleLikeMutation.isPending,
  };
};
