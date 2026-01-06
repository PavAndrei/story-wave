// use-my-blogs-infinite.ts
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useCallback, type RefCallback } from "react";
import type { GetMyBlogsApiResponse, MyBlogsFilters } from "@/shared/api/api";
import { blogApi } from "@/shared/api/blog-api";

export const useMyBlogsInfinite = (filters: MyBlogsFilters) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    GetMyBlogsApiResponse,
    Error,
    InfiniteData<GetMyBlogsApiResponse>,
    readonly [string, "my", MyBlogsFilters],
    number
  >({
    queryKey: [blogApi.baseKey, "my", filters],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      blogApi.getMyBlogs({
        ...filters,
        page: pageParam,
        limit: 3,
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

  const blogs =
    data?.pages
      .map((page) => page.blogs)
      .filter((blog) => blog !== undefined)
      .flat() || [];
  const pagination = data?.pages.at(-1)?.pagination;

  return {
    blogs,
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
