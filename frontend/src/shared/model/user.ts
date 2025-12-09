import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/api";

export const useMyProfile = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: [userApi.baseKey, "me"],
    queryFn: () => userApi.getMyProfile(),
    retry: false,
  });

  return {
    userData: data?.data ?? null,
    error: error instanceof Error ? error.message : String(error),
    pending: isLoading,
  };
};
