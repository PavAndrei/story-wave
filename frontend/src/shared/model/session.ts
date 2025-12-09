import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "../api/api";

export const useSession = () => {
  // const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: sessionApi.getSession,
    retry: false,
  });

  // const deleteSessionMutation = useMutation({
  //   mutationFn: (id: string) => sessionApi.deleteSession(id),

  //   async onSettled() {
  //     queryClient.invalidateQueries({ queryKey: [sessionApi.deleteSession] });
  //   },
  // });

  return {
    sessions: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    isError: sessionQuery.isError,
    // deleteSession: deleteSessionMutation.mutate,
    //     isDeleting: deleteSessionMutation.isPending,
  };
};
