import { uploadApi } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export type UploadedImage = {
  id: string;
  url: string;
};

export const useUploadImages = (files: File[], postId: string) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const formData = useMemo(() => {
    const fd = new FormData();
    files.forEach((file) => fd.append("images", file));
    return fd;
  }, [files]);

  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => uploadApi.uploadImages(postId, data),

    onSuccess: (response) => {
      if (response.data) {
        setImages(response.data);
      }
    },

    onError: (error) => {
      console.error("UPLOAD FAILED:", error?.message);
    },
  });

  useEffect(() => {
    if (!files.length || !postId) return;
    uploadMutation.mutate(formData);
  }, [files, postId, formData]);

  return {
    images, // ← { id, url }[]
    isPending: uploadMutation.isPending,
    errorMessage: uploadMutation.isError
      ? (uploadMutation.error?.message ?? "Upload failed")
      : null,
  };
};
