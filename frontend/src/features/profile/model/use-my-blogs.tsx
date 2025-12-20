import { blogApi } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";

export const useMyBlogs = () => {
  const { data, isLoading, error } = useQuery({
    queryFn: blogApi.getMyBlogs,
    queryKey: [blogApi.baseKey, "my"],
  });

  return {
    myBlogs: data?.blogs ?? null,
    isLoading,
    error: error instanceof Error ? error.message : String(error),
  };
};
