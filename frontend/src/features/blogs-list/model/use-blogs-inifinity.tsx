// use-my-blogs-infinite.ts
import { blogApi } from "@/shared/api/api";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useCallback, type RefCallback } from "react";
import type { GetAllBlogsApiResponse, BlogsFilters } from "@/shared/api/api";

export const useBlogsInfinite = (filters: BlogsFilters) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    GetAllBlogsApiResponse,
    Error,
    InfiniteData<GetAllBlogsApiResponse>,
    readonly [string, "public", BlogsFilters],
    number
  >({
    queryKey: [blogApi.baseKey, "public", filters],

    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      blogApi.getAllBlogs({
        ...filters,
        page: pageParam,
        limit: 6,
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

  console.log(data);

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
