import { blogApi } from "@/shared/api/blog-api";
import { useQuery } from "@tanstack/react-query";

export const useTrendingBlogs = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: [blogApi.baseKey, "trending"],
    queryFn: () => blogApi.getTopBlogs(3),
  });

  return {
    trendingBlogs: data?.blogs,
    isLoading,
    errorMessage: error?.message,
  };
};
