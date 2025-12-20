import { blogApi } from "@/shared/api/api";
import { useQuery } from "@tanstack/react-query";

type UseMyBlogsParams = {
  filters: {
    status?: "draft" | "published" | "archived";
    sort: "newest" | "oldest";
    search: string;
    categories: string[];
  };
};

export const useMyBlogs = ({ filters }: UseMyBlogsParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [blogApi.baseKey, "my", filters],
    queryFn: () => blogApi.getMyBlogs(filters),
  });

  return {
    myBlogs: data?.blogs ?? [],
    isLoading,
    error: error instanceof Error ? error.message : String(error),
  };
};
