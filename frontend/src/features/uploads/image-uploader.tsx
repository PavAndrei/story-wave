import { Button } from "@/shared/ui/kit/button";
import { Copy, Trash2 } from "lucide-react";
import { useImageUploader } from "./use-image-uploader";
import { useImageActions } from "./use-image-actions";

export type UploadedImage = {
  id: string;
  url: string;
};

type ImageUploaderProps = {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  max?: number;
  blogId: string;
};

export const ImageUploader = ({
  value,
  onChange,
  max = 10,
  blogId,
}: ImageUploaderProps) => {
  const { inputRef, isPending, selectFiles } = useImageUploader({
    value,
    onChange,
    blogId,
    max,
  });

  const { canAddMore, deleteImage, copyToClipboard } = useImageActions({
    value,
    onChange,
    max,
  });

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => selectFiles(e.target.files)}
      />

      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={!canAddMore}
        className="max-w-fit bg-slate-100 text-slate-700 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-50"
      >
        Choose images
      </Button>

      <div className="flex flex-wrap gap-3">
        {value.map((image) => (
          <div key={image.id} className="flex flex-col gap-1 max-w-[200px]">
            <div className="relative">
              <img
                src={image.url}
                className="w-[200px] h-32 object-cover border rounded-md"
              />

              <button
                type="button"
                onClick={() => deleteImage(image)}
                className="absolute top-2 right-2 bg-red-700 rounded-full w-8 h-8 flex items-center justify-center text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(image.url)}
              className="text-xs text-slate-700 flex items-center gap-1 hover:text-slate-400 break-all"
            >
              {image.url}
              <Copy size={12} />
            </button>
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600">
        {value.length}/{max} images
        {isPending && " · uploading..."}
      </p>
    </div>
  );
};
