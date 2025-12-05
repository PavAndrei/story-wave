import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";

type LoginPayload = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),

    onSuccess: (data) => {
      console.log("LOGIN SUCCESS:", data);
      navigate(ROUTES.HOME);
    },

    onError: (error) => {
      console.error("LOGIN FAILED:", error.message);
    },
  });

  return {
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    errorMessage: loginMutation.isError ? loginMutation.error.message : null,
  };
};
