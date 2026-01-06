import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/api";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { authApi } from "./auth-api";
import { sessionApi } from "./session-api";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [sessionApi.baseKey] });
      queryClient.removeQueries({ queryKey: [userApi.baseKey] });
      queryClient.removeQueries({ queryKey: [authApi.baseKey] });
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error("Logout failed:", error.message);
    },
  });

  const errorMessage = logoutMutation.isError
    ? logoutMutation.error.message
    : null;

  return {
    logout: logoutMutation.mutate,
    isPending: logoutMutation.isPending,
    errorMessage,
  };
};
