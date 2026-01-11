import type { GetCommentsApiResponse } from "@/shared/api/api-types";
import { commentApi } from "@/shared/api/comment-api";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useCallback, type RefCallback } from "react";

export const usePublicCommentsInfinity = ({
  blogId,
  enabled = true,
}: {
  blogId: string;
  enabled?: boolean;
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    GetCommentsApiResponse,
    Error,
    InfiniteData<GetCommentsApiResponse>,
    readonly [string, "blog", string],
    number
  >({
    queryKey: [commentApi.baseKey, "blog", blogId],

    initialPageParam: 1,

    enabled,

    queryFn: ({ pageParam }) =>
      commentApi.getPublicComments({
        blogId,
        page: pageParam,
        limit: 10,
      }),

    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const cursorRef: RefCallback<HTMLDivElement> = useCallback(
    (node) => {
      if (!node || !hasNextPage || isFetchingNextPage) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { rootMargin: "200px" },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  const comments =
    data?.pages
      .map((page) => page.comments)
      .filter(Boolean)
      .flat() || [];

  const pagination = data?.pages.at(-1)?.pagination;

  return {
    comments,
    pagination,

    cursorRef,

    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,

    isLoading,
    isError,
    error: error?.message,
  };
};
