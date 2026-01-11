import { authApi } from "@/shared/api/auth-api";
import { queryClient } from "@/shared/api/query-client";
import { sessionApi } from "@/shared/api/session-api";
import { userApi } from "@/shared/api/user-api";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useDeleteProfile = () => {
  const navigate = useNavigate();

  const profileDeleteMutation = useMutation({
    mutationFn: userApi.deleteMyProfile,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [sessionApi.baseKey] });
      queryClient.removeQueries({ queryKey: [userApi.baseKey] });
      queryClient.removeQueries({ queryKey: [authApi.baseKey] });
      navigate(ROUTES.LOGIN, { replace: true });
    },

    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });

  const errorMessage = profileDeleteMutation.isError
    ? profileDeleteMutation.error.message
    : null;

  return {
    deleteProfile: profileDeleteMutation.mutate,
    isPending: profileDeleteMutation.isPending,
    errorMessage,
  };
};
