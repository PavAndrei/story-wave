import { blogApi } from "@/shared/api/api";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { startTransition, useOptimistic } from "react";
import type { BlogFavoriteCardTogglerProps } from "./blog-favorite-card-toggler";

type OptimisticFavoriteState = {
  isFavorite: boolean;
};

export const useToggleFavorite = () => {
  const [favorites, setFavorites] = useOptimistic<
    Record<string, OptimisticFavoriteState>
  >({});

  const toggleFavoriteMutation = useMutation({
    mutationFn: (blogId: string) => blogApi.toggleFavorite(blogId),

    onSettled: async () => {
      // сервер → источник истины
      await queryClient.invalidateQueries({
        queryKey: [blogApi.baseKey],
      });
    },
  });

  const toggle = (blog: BlogFavoriteCardTogglerProps) => {
    startTransition(async () => {
      const current = favorites[blog._id] ?? {
        isFavorite: blog.isFavorite ?? false,
      };

      const next: OptimisticFavoriteState = {
        isFavorite: !current.isFavorite,
      };

      // 🔥 важно: optimistic всегда источник истины
      setFavorites((prev) => ({
        ...prev,
        [blog._id]: next,
      }));

      await toggleFavoriteMutation.mutateAsync(blog._id);
    });
  };

  const getFavoritesState = (
    blog: BlogFavoriteCardTogglerProps,
  ): OptimisticFavoriteState => {
    return (
      favorites[blog._id] ?? {
        isFavorite: blog.isFavorite ?? false,
      }
    );
  };

  return {
    toggle,
    getFavoritesState,
    isPending: toggleFavoriteMutation.isPending,
  };
};
