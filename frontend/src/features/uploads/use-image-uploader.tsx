import { useEffect, useRef, useState } from "react";
import { useUploadImages } from "@/features/uploads/use-upload-images";
import type { UploadedImage } from "./image-uploader";

type Params = {
  blogId: string;
  mode: "single" | "multiple";
  onUploaded: (images: UploadedImage[]) => void;
};

export const useImageUploader = ({ blogId, mode, onUploaded }: Params) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  const { images, isPending } = useUploadImages(files, blogId);

  const selectFiles = (filesList: FileList | null) => {
    if (!filesList) return;

    const selected = mode === "single" ? [filesList[0]] : Array.from(filesList);

    setFiles(selected.filter(Boolean) as File[]);
    inputRef.current!.value = "";
  };

  useEffect(() => {
    if (!images.length) return;

    const getFiles = () => {
      onUploaded(images);
      setFiles([]);
    };

    getFiles();
  }, [images]);

  return {
    inputRef,
    isPending,
    selectFiles,
  };
};
