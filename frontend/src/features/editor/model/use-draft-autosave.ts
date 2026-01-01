import { useEffect, useState } from "react";
import { useSaveDraft } from "./use-save-draft";

type Params = {
  blogId?: string;
  title?: string;
  content?: string;
  categories?: string[];
  coverImgUrl?: string;
  onFirstSave?: (blogId: string) => void;
  enabled?: boolean;
  canAutoSave?: boolean;
};

export const useDraftAutosave = ({
  blogId,
  title,
  content,
  categories,
  coverImgUrl,
  enabled,
  onFirstSave,
}: Params) => {
  const { saveDraftFunction } = useSaveDraft();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!enabled) return;

    if (!title && !content) return;

    const timeout = setTimeout(async () => {
      try {
        setStatus("saving");

        if (!blogId) {
          const blog = await saveDraftFunction({
            blogId,
            status: "draft",
          });
          onFirstSave?.(blog._id);
          return;
        }

        const blog = await saveDraftFunction({
          blogId,
          status: "draft",
          title,
          content,
          categories,
          coverImgUrl,
        });

        if (!blogId && blog?._id) {
          onFirstSave?.(blog._id);
        }

        setLastSavedAt(new Date());
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [title, content, categories, coverImgUrl]);

  return { status, lastSavedAt };
};
