import { authApi } from "@/shared/api/auth-api";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const useRegister = () => {
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),

    onSuccess: (data) => {
      console.log("REGISTER SUCCESS:", data);
      navigate(ROUTES.VERIFY_PENDING);
    },

    onError: (error) => {
      console.error("REGISTER FAILED:", error.message);
    },
  });

  return {
    register: registerMutation.mutate,
    isPending: registerMutation.isPending,
    errorMessage: registerMutation.isError
      ? registerMutation.error.message
      : null,
  };
};
