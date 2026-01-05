import { useQuery } from "@tanstack/react-query";
import { blogApi } from "@/shared/api/api";

export const useRecentBlogs = () => {
  const query = useQuery({
    queryKey: [blogApi.baseKey, "recent"],
    queryFn: () => blogApi.getRecent(),
    select: (data) => data.blogs,
    staleTime: 1000 * 60 * 5,
  });

  return {
    blogs: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
