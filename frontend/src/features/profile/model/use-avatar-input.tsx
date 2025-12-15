import { useDropzone } from "react-dropzone";
import { useEffect, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { EditProfileFormValues } from "../ui/profile-edit-form";

type UseAvatarInputParams = {
  form: UseFormReturn<EditProfileFormValues>;
  initialAvatarUrl?: string | null;
};

export const useAvatarInput = ({
  form,
  initialAvatarUrl,
}: UseAvatarInputParams) => {
  /**
   * Single source of truth — react-hook-form
   */
  const avatarFile = form.watch("avatar");
  const removeAvatar = form.watch("removeAvatar");

  /**
   * Dropzone
   */
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (files) => {
      const file = files[0];
      if (!file) return;

      form.clearErrors("avatar");
      form.setValue("avatar", file, { shouldValidate: true });
      form.setValue("removeAvatar", false);
    },
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (!error) return;

      form.setError("avatar", {
        type: "manual",
        message:
          error.code === "file-too-large"
            ? "File is too large (max 5MB)"
            : "Invalid file type",
      });
    },
  });

  const avatarPreview = useMemo(() => {
    // User explicitly removed avatar
    if (removeAvatar) return null;

    // New file selected
    if (avatarFile instanceof File) {
      return URL.createObjectURL(avatarFile);
    }

    // Existing avatar from backend
    return initialAvatarUrl ?? null;
  }, [avatarFile, initialAvatarUrl, removeAvatar]);

  /**
   * Cleanup object URL
   */
  useEffect(() => {
    if (!(avatarFile instanceof File) || !avatarPreview) return;

    return () => {
      URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarFile, avatarPreview]);

  /**
   * Clear avatar (click on X)
   */
  const clearAvatar = () => {
    form.setValue("avatar", null, { shouldValidate: true });
    form.setValue("removeAvatar", true);
    form.clearErrors("avatar");
  };

  /**
   * Reset avatar (form reset)
   */
  const resetAvatar = () => {
    form.setValue("avatar", null);
    form.setValue("removeAvatar", false);
  };

  return {
    avatarPreview,
    getRootProps,
    getInputProps,
    clearAvatar,
    resetAvatar,
  };
};
