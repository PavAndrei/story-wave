import type {
  ApiResponseWithBlogsAndPagination,
  BlogsPagination,
} from "@/shared/api/api-types";
import { blogApi } from "@/shared/api/blog-api";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { useCallback, type RefCallback } from "react";

export const useRecentBlogs = ({
  filters,
  enabled,
}: {
  filters: Pick<BlogsPagination, "page" | "limit">;
  enabled: boolean | null;
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
    ApiResponseWithBlogsAndPagination,
    Error,
    InfiniteData<ApiResponseWithBlogsAndPagination>,
    readonly [string, "recent", Pick<BlogsPagination, "page" | "limit">],
    number
  >({
    queryKey: [blogApi.baseKey, "recent", filters],
    enabled: !!enabled,
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      blogApi.getRecentBlogs({
        ...filters,
        page: pageParam,
        limit: 12,
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

  if (!enabled)
    return {
      blogs: [],
      isLoading: false,
    };

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
