import { blogApi } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";

export const useGetTopBlogs = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: [blogApi.baseKey, "top"],
    queryFn: blogApi.getTopBlogs,
  });

  const errorMessage = isError ? error.message : null;

  return {
    topBlogs: data?.blogs,
    isLoading,
    errorMessage,
  };
};
