import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "../api/session-api";

export const useSession = () => {
  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: sessionApi.getSession,
    retry: false,
  });

  return {
    sessions: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    isError: sessionQuery.isError,
  };
};
