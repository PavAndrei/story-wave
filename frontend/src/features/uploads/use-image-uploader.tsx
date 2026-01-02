import { useEffect, useRef } from "react";
import { useUploadImages } from "@/features/uploads/use-upload-images";
import type { UploadedImage } from "./image-uploader";

type Params = {
  blogId: string;
  mode: "single" | "multiple";
  onUploaded: (images: UploadedImage[]) => void;
};

export const useImageUploader = ({ blogId, mode, onUploaded }: Params) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, images, isPending } = useUploadImages(blogId);

  const selectFiles = (filesList: FileList | null) => {
    if (!filesList) return;

    const selected = mode === "single" ? [filesList[0]] : Array.from(filesList);

    upload(selected.filter(Boolean) as File[]);
    inputRef.current!.value = "";
  };

  useEffect(() => {
    if (!images.length) return;
    onUploaded(images);
  }, [images]);

  return {
    inputRef,
    isPending,
    selectFiles,
  };
};
