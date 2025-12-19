import { uploadApi } from "@/shared/api/api";
import { useClipboard } from "@/shared/lib/hooks/use-clipboard";
import type { UploadedImage } from "./image-uploader";

type Params = {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  max: number;
};

export const useImageActions = ({ value, onChange, max }: Params) => {
  const { copyToClipboard } = useClipboard();

  const canAddMore = value.length < max;

  const deleteImage = async (image: UploadedImage) => {
    try {
      await uploadApi.deleteImage(image.id);
      onChange(value.filter((img) => img.id !== image.id));
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  return {
    canAddMore,
    deleteImage,
    copyToClipboard,
  };
};
