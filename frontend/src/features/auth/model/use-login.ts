import { authApi } from "@/shared/api/auth-api";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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
      if (
        error.message ===
        "Email is not verified. Please verify your email before logging in."
      ) {
        navigate(ROUTES.VERIFY_PENDING);
      }
    },
  });

  return {
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    errorMessage: loginMutation.isError ? loginMutation.error.message : null,
  };
};
