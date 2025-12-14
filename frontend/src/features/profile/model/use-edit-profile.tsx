import { userApi } from "@/shared/api/api";
import { queryClient } from "@/shared/api/query-client";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type EditProfilePayload = {
  id: string;
  formData: FormData;
};

export const useEditProfile = () => {
  const navigate = useNavigate();

  const editProfileMutation = useMutation({
    mutationFn: (payload: EditProfilePayload) => userApi.editMyProfile(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [userApi.baseKey] });
      navigate(ROUTES.PROFILE);
    },

    onError: (error) => {
      console.log(error.message);
    },
  });

  const errorMessage = editProfileMutation.isError
    ? editProfileMutation.error.message
    : null;

  return {
    editProfile: editProfileMutation.mutate,
    isPending: editProfileMutation.isPending,
    errorMessage,
  };
};
