import { useEffect, useRef, useState } from "react";
import { blogApi } from "@/shared/api/api";

type UseDraftAutosaveProps = {
  blogId?: string;
  title?: string;
  content: string;
  categories?: string[] | null;
  coverImgUrl?: string;
  enabled?: boolean;
};

type AutosaveStatus = "idle" | "saving" | "saved" | "error";

const AUTOSAVE_DELAY = 1500;

export const useDraftAutosave = ({
  blogId,
  title,
  content,
  categories,
  coverImgUrl,
  enabled = true,
}: UseDraftAutosaveProps) => {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // snapshot последнего сохранения
  const lastSavedRef = useRef<string>("");

  // debounce timer
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // актуальный blogId (если создастся новый)
  const blogIdRef = useRef<string | undefined>(blogId);

  useEffect(() => {
    blogIdRef.current = blogId;
  }, [blogId]);

  useEffect(() => {
    if (!enabled) return;

    // собираем snapshot
    const snapshot = JSON.stringify({
      title,
      content,
      categories,
      coverImgUrl,
    });

    // если ничего не изменилось — выходим
    if (snapshot === lastSavedRef.current) {
      return;
    }

    // сбрасываем предыдущий debounce
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        setStatus("saving");

        const response = await blogApi.saveBlog({
          blogId: blogIdRef.current,
          status: "draft",
          title,
          content,
          categories,
          coverImgUrl,
        });

        // если blog создавался впервые — сохраняем id
        if (!blogIdRef.current) {
          blogIdRef.current = response.blog._id;
        }

        lastSavedRef.current = snapshot;
        setLastSavedAt(new Date());
        setStatus("saved");
      } catch (err) {
        console.error("AUTOSAVE FAILED:", err);
        setStatus("error");
      }
    }, AUTOSAVE_DELAY);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [title, content, categories, coverImgUrl, enabled]);

  return {
    status,
    lastSavedAt,
  };
};
