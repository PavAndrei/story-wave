import type {
  ApiResponseWithBlogsAndPagination,
  PublicBlogsFilters,
} from "@/shared/api/api-types";
import { blogApi } from "@/shared/api/blog-api";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useCallback, type RefCallback } from "react";

export const useBlogsInfinite = (filters: PublicBlogsFilters) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<
    ApiResponseWithBlogsAndPagination,
    Error,
    InfiniteData<ApiResponseWithBlogsAndPagination>,
    readonly [string, "public", PublicBlogsFilters],
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
