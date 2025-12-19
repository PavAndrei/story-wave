import { useEffect, useRef, useState } from "react";
import { useUploadImages } from "./use-upload-images";
import type { UploadedImage } from "./image-uploader";

type Params = {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  blogId: string;
  max: number;
};

export const useImageUploader = ({ value, onChange, blogId, max }: Params) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const { images, isPending } = useUploadImages(files, blogId);

  /* ---------- select files ---------- */
  const selectFiles = (filesList: FileList | null) => {
    if (!filesList) return;

    const selected = Array.from(filesList).slice(0, max - value.length);
    setFiles(selected);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  /* ---------- sync uploaded images ---------- */
  useEffect(() => {
    const syncImages = () => {
      onChange([...value, ...images]);
      setFiles([]);
    };

    if (!images.length) return;
    syncImages();
  }, [images]); // ← оставляем как ты просил

  return {
    inputRef,
    isPending,
    selectFiles,
  };
};
