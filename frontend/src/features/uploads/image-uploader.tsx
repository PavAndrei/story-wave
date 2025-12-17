import { Button } from "@/shared/ui/kit/button";
import { Copy, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useUploadImages } from "./use-upload-images";
import { useClipboard } from "@/shared/lib/hooks/use-clipboard";

export const ImageUploader = () => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  const { copyToClipboard } = useClipboard();

  const { urls } = useUploadImages(files);
  console.log(urls);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);

    if (ref.current) {
      ref.current.value = "";
    }
  };

  const handleDelete = (i: number) => {
    if (previews[i]) {
      URL.revokeObjectURL(previews[i]);
    }

    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    newPreviews.splice(i, 1);
    setPreviews(newPreviews);
  };

  useEffect(() => {
    const renderPreviews = () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    };
    renderPreviews();

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  console.log(files);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
        ref={ref}
        key={files.length}
      />

      <Button
        type="button"
        className="cursor-pointer bg-slate-100 text-slate-700 font-medium text-base py-2 px-4 hover:bg-slate-700 hover:text-slate-100 active:scale-95 max-w-fit flex gap-2 justify-start"
        onClick={() => ref.current?.click()}
      >
        Press button to choose images
      </Button>

      <div className="flex gap-2 w-full flex-wrap">
        {previews.map((preview, i) => (
          <div className="flex flex-col">
            <div className="relative max-w-[200px]" key={i}>
              <img
                className="h-30 w-[200px] object-cover border border-slate-700 rounded-md"
                src={preview}
                alt={`Preview ${i}`}
              />
              <button
                type="button"
                className="absolute rounded-full w-10 h-10 bg-red-700 text-2xl text-center flex items-center justify-center text-slate-200 top-2 right-2 cursor-pointer hover:text-slate-100 hover:bg-red-600 transition-colors duration-200 ease-in-out"
                onClick={() => handleDelete(i)}
              >
                <Trash2 />
              </button>
            </div>
            {urls && (
              <button
                type="button"
                onClick={() => copyToClipboard(urls[i])}
                className="text-base text-slate-700 flex gap-2 items-center hover:text-slate-400 transition-colors duration-200 ease-in-out cursor-pointer"
              >
                {urls[i]}
                <Copy className="text-sm" />
              </button>
            )}
          </div>
        ))}
      </div>
      <div>
        {files.length === 0 && (
          <p className="text-sm text-slate-700">
            You haven't uploaded any images yet. Press the button above to
            start.
          </p>
        )}

        {files.length < 10 && files.length > 0 && (
          <p className="text-sm text-slate-700">
            You have uploaded {files.length}
            {files.length === 1 ? " image" : " images"} / 10
          </p>
        )}
        {files.length === 10 && (
          <p className="text-sm text-slate-700">
            You can only upload a maximum of 10 images
          </p>
        )}
      </div>
    </div>
  );
};
