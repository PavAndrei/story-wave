import { authApi, sessionApi, userApi } from "@/shared/api/api";
import { queryClient } from "@/shared/api/query-client";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

export const useResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const code = searchParams.get("code");

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { password: string }) => {
      if (!code) {
        throw new Error("Invalid reset link");
      }

      return authApi.resetPassword({
        password: data.password,
        verificationCode: code,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [authApi.baseKey] });
      await queryClient.invalidateQueries({ queryKey: [userApi.baseKey] });
      await queryClient.invalidateQueries({ queryKey: [sessionApi.baseKey] });

      navigate(ROUTES.LOGIN);
    },

    onError: (error) => {
      console.error("RESET PASSWORD FAILED:", error.message);
    },
  });

  const errorMessage = resetPasswordMutation.isError
    ? resetPasswordMutation.error.message
    : null;

  return {
    resetPassword: resetPasswordMutation.mutate,
    isPending: resetPasswordMutation.isPending,
    errorMessage,
  };
};
