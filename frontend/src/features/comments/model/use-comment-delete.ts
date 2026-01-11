import { commentApi } from "@/shared/api/comment-api";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { GetCommentsApiResponse } from "@/shared/api/api-types";

export const useCommentDelete = () => {
  const mutation = useMutation({
    mutationFn: (commentId: string) => commentApi.deleteComment(commentId),

    async onMutate(commentId) {
      // 1️⃣ Останавливаем запросы комментариев
      await queryClient.cancelQueries({
        queryKey: [commentApi.baseKey],
      });

      // 2️⃣ Сохраняем ВСЕ comment-запросы
      const previousQueries = queryClient.getQueriesData<
        InfiniteData<GetCommentsApiResponse>
      >({
        queryKey: [commentApi.baseKey],
      });

      // 3️⃣ Оптимистично обновляем ВСЕ comment-кэши

      queryClient.setQueriesData<InfiniteData<GetCommentsApiResponse>>(
        { queryKey: [commentApi.baseKey] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              comments: page.comments
                .filter((c) => c._id !== commentId)
                .map((c) => ({
                  ...c,
                  replies: c.replies?.filter((r) => r._id !== commentId),
                })),
            })),
          };
        },
      );

      // 4️⃣ snapshot для rollback
      return { previousQueries };
    },

    onError(_error, _commentId, context) {
      // 5️⃣ rollback
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled() {
      // 6️⃣ финальная синхронизация
      queryClient.invalidateQueries({
        queryKey: [commentApi.baseKey],
      });
    },
  });

  return {
    deleteComment: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.isError ? mutation.error.message : null,
  };
};
