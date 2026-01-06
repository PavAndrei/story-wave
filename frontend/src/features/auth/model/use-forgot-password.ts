import { authApi } from "@/shared/api/auth-api";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email }: { email: string }) => authApi.forgotPassword(email),

    onSuccess: (data) => {
      console.log("LOGIN SUCCESS:", data);
    },

    onError: (error) => {
      console.error("REGISTER FAILED:", error.message);
    },
  });

  const errorMessage = forgotPasswordMutation.isError
    ? forgotPasswordMutation.error.message
    : null;

  return {
    forgotPassword: forgotPasswordMutation.mutate,
    isPending: forgotPasswordMutation.isPending,
    errorMessage,
  };
};
