import { queryClient } from "@/shared/api/query-client";
import { userApi } from "@/shared/api/user-api";
import { ROUTES } from "@/shared/model/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type EditProfilePayload = {
  id: string;
  payloadData: FormData;
};

export const useEditProfile = () => {
  const navigate = useNavigate();

  const editProfileMutation = useMutation({
    mutationFn: (payload: EditProfilePayload) => userApi.editMyProfile(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [userApi.baseKey] });
      toast.success("Your profile has been updated", {
        duration: 5000,
        classNames: { content: "text-slate-700", icon: "text-cyan-700" },
      });
      navigate(ROUTES.PROFILE);
    },

    onError: (error) => {
      toast.error(error.message ?? "Something went wrong...", {
        duration: 5000,
        classNames: { content: "text-destructive", icon: "text-destructive" },
      });
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
