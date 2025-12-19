import { Button } from "@/shared/ui/kit/button";
import { Copy, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useUploadImages } from "./use-upload-images";
import { useClipboard } from "@/shared/lib/hooks/use-clipboard";
import { uploadApi } from "@/shared/api/api";

type ImageUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  postId: string; // новый обязательный проп
};

export const ImageUploader = ({
  value,
  onChange,
  max = 10,
  postId,
}: ImageUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  const { copyToClipboard } = useClipboard();
  const { urls, isPending } = useUploadImages(files, postId);

  /* ---------- file select ---------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files).slice(0, max - files.length);
    setFiles((prev) => [...prev, ...selected]);

    if (ref.current) ref.current.value = "";
  };

  /* ---------- delete ---------- */
  const handleDelete = async (index: number) => {
    // удалить превью
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));

    // удалить с сервера, если уже загружено
    const urlToDelete = value[index];
    if (urlToDelete) {
      try {
        await uploadApi.deleteImage(urlToDelete); // предполагаем, что API умеет удалять по url
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    // обновляем value
    onChange(value.filter((_, i) => i !== index));
  };

  /* ---------- previews ---------- */
  useEffect(() => {
    const updatePreviews = () => {
      // сначала удаляем старые превью
      previews.forEach((url) => URL.revokeObjectURL(url));

      // создаем новые
      const next = files.map((file) => URL.createObjectURL(file));
      setPreviews(next);

      // возвращаем функцию очистки
      return () => next.forEach((url) => URL.revokeObjectURL(url));
    };

    const cleanup = updatePreviews();
    return cleanup;
  }, [files]);

  /* ---------- sync uploaded urls with form ---------- */
  useEffect(() => {
    if (!urls) return;
    onChange(urls);
  }, [urls]);

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleChange}
      />

      <Button
        type="button"
        onClick={() => ref.current?.click()}
        className="max-w-fit bg-slate-100 text-slate-700 hover:bg-slate-700 hover:text-slate-100"
      >
        Choose images
      </Button>

      <div className="flex flex-wrap gap-3">
        {previews.map((preview, i) => (
          <div key={i} className="flex flex-col gap-1 max-w-[200px]">
            <div className="relative">
              <img
                src={preview}
                className="w-[200px] h-32 object-cover border rounded-md"
              />
              <button
                type="button"
                onClick={() => handleDelete(i)}
                className="absolute top-2 right-2 bg-red-700 rounded-full w-8 h-8 flex items-center justify-center text-white"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {value[i] && (
              <button
                type="button"
                onClick={() => copyToClipboard(value[i])}
                className="text-xs text-slate-700 flex items-center gap-1 hover:text-slate-400"
              >
                {value[i]}
                <Copy size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-600">
        {files.length}/{max} images
        {isPending && " · uploading..."}
      </p>
    </div>
  );
};
