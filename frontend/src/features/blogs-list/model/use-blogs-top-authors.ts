import { userApi } from "@/shared/api/user-api";
import { useQuery } from "@tanstack/react-query";

export const useBlogsTopAuthors = () => {
  const { data, isFetching, error, isError } = useQuery({
    queryKey: [userApi.baseKey, "top"],
    queryFn: userApi.getTopUsers,
  });

  const errorMessage = isError ? error.message : null;

  return {
    topAuthors: data?.users,
    isLoading: isFetching,
    errorMessage,
  };
};
