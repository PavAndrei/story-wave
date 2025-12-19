import { uploadApi } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useUploadImages = (files: File[], postId: string) => {
  const [urls, setUrls] = useState<string[]>();

  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const imagesUploadMutation = useMutation({
    mutationFn: (data: FormData) => uploadApi.uploadImages(postId, data),
    onSuccess: (data) => {
      if (data.data) setUrls(data.data);
    },
    onError: (error) => console.error("UPLOAD FAILED:", error.message),
  });

  useEffect(() => {
    if (!files.length) return;
    imagesUploadMutation.mutate(formData);
  }, [files]);

  const errorMessage = imagesUploadMutation.isError
    ? imagesUploadMutation.error?.message
    : null;

  return {
    uploadImages: () => imagesUploadMutation.mutate(formData),
    isPending: imagesUploadMutation.isPending,
    errorMessage,
    urls,
  };
};
