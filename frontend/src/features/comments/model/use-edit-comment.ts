import { useMutation } from "@tanstack/react-query";
import { commentApi } from "@/shared/api/comment-api";
import { queryClient } from "@/shared/api/query-client";
import type { GetCommentsApiResponse } from "@/shared/api/api-types";
import type { InfiniteData } from "@tanstack/react-query";

export const useEditComment = () => {
  const mutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentApi.editComment(commentId, { content }),

    onSuccess(response) {
      const updatedComment = response.comment;

      // 🔹 Обновляем ВСЕ comment-кэши
      queryClient.setQueriesData<InfiniteData<GetCommentsApiResponse>>(
        { queryKey: ["comment"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              comments: page.comments.map((c) => {
                // root comment
                if (c._id === updatedComment._id) {
                  return {
                    ...c,
                    ...updatedComment,
                    author: c.author, // ← КЛЮЧЕВО
                    blog: c.blog, // ← тоже сохраняем
                    replies: c.replies,
                  };
                }

                // replies
                if (c.replies) {
                  return {
                    ...c,
                    replies: c.replies.map((r) =>
                      r._id === updatedComment._id ? updatedComment : r,
                    ),
                  };
                }

                return c;
              }),
            })),
          };
        },
      );
    },
  });

  return {
    editComment: mutation.mutate,
    isPending: mutation.isPending,
    errorMessage: mutation.isError ? mutation.error.message : null,
  };
};
