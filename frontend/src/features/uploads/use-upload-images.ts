import { uploadApi } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export type UploadedImage = {
  id: string;
  url: string;
};

export const useUploadImages = (files: File[], blogId: string) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const formData = useMemo(() => {
    const fd = new FormData();
    files.forEach((file) => fd.append("images", file));
    return fd;
  }, [files]);

  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => uploadApi.uploadImages(blogId, data),

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
    if (!files.length || !blogId) return;
    uploadMutation.mutate(formData);
  }, [files, blogId, formData, uploadMutation]);

  if (!blogId || files.length === 0) {
    return {
      images: [],
      isPending: false,
    };
  }

  return {
    images, // ← { id, url }[]
    isPending: uploadMutation.isPending,
    errorMessage: uploadMutation.isError
      ? (uploadMutation.error?.message ?? "Upload failed")
      : null,
  };
};
