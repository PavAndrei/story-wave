import { useEffect, useState, type RefObject } from "react";

type PreviewStats = {
  characters: number;
  words: number;
  paragraphs: number;
};

export const usePreviewStats = (
  previewRef: RefObject<HTMLElement>,
  value: string,
): PreviewStats => {
  const [stats, setStats] = useState<PreviewStats>({
    characters: 0,
    words: 0,
    paragraphs: 0,
  });

  useEffect(() => {
    const root = previewRef.current;
    if (!root) return;

    const text = root.textContent ?? "";

    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    const paragraphs = root.querySelectorAll("p").length;

    setStats({
      characters,
      words,
      paragraphs,
    });
  }, [value]);

  return stats;
};
