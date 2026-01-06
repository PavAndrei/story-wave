import { queryClient } from "@/shared/api/query-client";
import { ROUTES, type PathParams } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { authApi } from "@/shared/api/auth-api";
import { sessionApi } from "@/shared/api/session-api";
import { userApi } from "@/shared/api/user-api";

export const useVerifyEmail = () => {
  const { code } = useParams<PathParams[typeof ROUTES.VERIFY]>();
  const navigate = useNavigate();
  const firstFetchRef = useRef(true);

  const verifyEmailMutation = useMutation({
    mutationFn: (code: string) => authApi.verifyEmailCode(code),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [userApi.baseKey] });
      await queryClient.invalidateQueries({ queryKey: [sessionApi.baseKey] });

      navigate(ROUTES.HOME);
    },
  });

  useEffect(() => {
    if (!firstFetchRef.current || !code) return;

    firstFetchRef.current = false;
    verifyEmailMutation.mutate(code);
  }, [code]);

  return {
    isPending: verifyEmailMutation.isPending,
    isError: verifyEmailMutation.isError,
  };
};
