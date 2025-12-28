import { useEffect, useState, type RefObject } from "react";

type MarkdownStats = {
  bytes: number;
  words: number;
  lines: number;
  line: number;
  column: number;
};

export const useMarkdownStats = (
  value: string,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
): MarkdownStats => {
  const [stats, setStats] = useState<MarkdownStats>({
    bytes: 0,
    words: 0,
    lines: 0,
    line: 1,
    column: 1,
  });

  useEffect(() => {
    const getStats = () => {
      const textarea = textareaRef.current;

      // bytes (UTF-8 safe enough for UI purposes)
      const bytes = new TextEncoder().encode(value).length;

      // words
      const words = value.trim() ? value.trim().split(/\s+/).length : 0;

      // lines
      const lines = value ? value.split("\n").length : 1;

      let line = 1;
      let column = 1;

      if (textarea) {
        const pos = textarea.selectionStart;
        const before = value.slice(0, pos);
        const parts = before.split("\n");

        line = parts.length;
        column = parts[parts.length - 1].length + 1;
      }

      setStats({
        bytes,
        words,
        lines,
        line,
        column,
      });
    };

    getStats();
  }, [value, textareaRef]);

  return stats;
};
