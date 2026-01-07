import { uploadApi } from "@/shared/api/upload-api";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export type UploadedImage = {
  id: string;
  url: string;
};

export const useUploadImages = (blogId: string) => {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => uploadApi.uploadImages(blogId, data),

    onSuccess: (response) => {
      if (response.data) {
        setImages(response.data);
      }
    },
  });

  const upload = (files: File[]) => {
    if (!files.length || !blogId) return;

    const fd = new FormData();
    files.forEach((file) => fd.append("images", file));

    uploadMutation.mutate(fd);
  };

  return {
    upload,
    images,
    isPending: uploadMutation.isPending,
    error: uploadMutation.error,
  };
};
