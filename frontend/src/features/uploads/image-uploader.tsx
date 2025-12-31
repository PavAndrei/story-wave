import { Button } from "@/shared/ui/kit/button";
import { Upload } from "lucide-react";
import { useImageUploader } from "./use-image-uploader";

export type UploadedImage =
  | {
      id: string; // image _id из Mongo
      url: string; // cloudinary url
    }
  | string; // временно: для совместимости с уже загруженными изображениями (url-строка)

export type EditorUploaderProps = {
  blogId: string;

  /**
   * Вставить markdown в редактор
   * Пример: ![](https://...)
   */
  insertMarkdown: (markdown: string) => void;

  /**
   * Синхронизация изображений с формой
   * (для imagesUrls)
   */
  onImagesChange: (images: UploadedImage[]) => void;

  /**
   * Текущий список изображений (из RHF)
   */
  images: UploadedImage[];

  max?: number;
};

export const ImageUploader = ({
  blogId,
  insertMarkdown,
  images,
  onImagesChange,
  max = 10,
}: EditorUploaderProps) => {
  const canAddMore = images.length < max;

  const { inputRef, isPending, selectFiles } = useImageUploader({
    blogId,
    mode: "multiple",
    onUploaded: (uploaded) => {
      // 1. вставляем markdown
      uploaded.forEach((img) => {
        if (typeof img === "string") return;
        insertMarkdown(`\n\n![](${img.url})\n\n`);
      });

      // 2. синхронизируем RHF
      onImagesChange([...images, ...uploaded]);
    },
  });

  return (
    <>
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
        size="sm"
        variant="ghost"
        disabled={!canAddMore || isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={16} />
      </Button>
    </>
  );
};

type CoverImageUploaderProps = {
  blogId: string;
  value: UploadedImage | null;
  onChange: (image: UploadedImage) => void;
};

export const CoverImageUploader = ({
  blogId,
  value,
  onChange,
}: CoverImageUploaderProps) => {
  const { inputRef, isPending, selectFiles } = useImageUploader({
    blogId,
    mode: "single",
    onUploaded: ([image]) => {
      onChange(image);
    },
  });

  return (
    <div className="flex flex-col gap-3">
      {value && (
        <img
          src={typeof value === "string" ? value : value.url}
          alt="Cover"
          className="w-full max-h-64 object-cover rounded-md"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => selectFiles(e.target.files)}
      />

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={16} className="mr-2" />
        {value ? "Change cover image" : "Upload cover image"}
      </Button>
    </div>
  );
};
