import { useDropzone } from "react-dropzone";
import type { UseFormReturn } from "react-hook-form";
import type { EditProfileFormValues } from "../ui/profile-edit-form";
import { useEffect, useMemo } from "react";

type UseAvatarInputParams = {
  form: UseFormReturn<EditProfileFormValues>;
  initialAvatarUrl?: string | null;
};

export const useAvatarInput = ({
  form,
  initialAvatarUrl,
}: UseAvatarInputParams) => {
  const avatarFile = form.watch("avatar");

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 1024 * 1024,
    onDrop: (files) => {
      const file = files[0];
      if (!file) return;

      form.clearErrors("avatar");
      form.setValue("avatar", file, { shouldValidate: true });
    },
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (!error) return;

      form.setError("avatar", {
        type: "manual",
        message:
          error.code === "file-too-large"
            ? "File is too large (max 1MB)"
            : "Invalid file",
      });
    },
  });
  const avatarPreview = useMemo(() => {
    if (!avatarFile) {
      return initialAvatarUrl ?? null;
    }
    return URL.createObjectURL(avatarFile);
  }, [avatarFile, initialAvatarUrl]);

  useEffect(() => {
    return () => {
      if (avatarFile && avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarFile, avatarPreview]);

  const clearAvatar = () => {
    form.setValue("avatar", null, { shouldValidate: true });
    form.clearErrors("avatar");
  };

  const resetAvatar = () => {
    form.setValue("avatar", null);
  };

  return {
    avatarPreview,
    getRootProps,
    getInputProps,
    clearAvatar,
    resetAvatar,
  };
};
