// features/markdown/markdown-editor.tsx
import { useRef } from "react";
import { Textarea } from "@/shared/ui/kit/textarea";
import { MarkdownRenderer } from "./markdown-renderer";
import { MarkdownToolbar } from "./markdown-toolbar";
import { useMarkdownToolbar } from "./use-markdown-toolbar";
import { ImageUploader } from "../uploads";
import { useMarkdownStats } from "./use-markdown-stats";
import { usePreviewStats } from "./use-preview-stats";
import { StatsBar } from "./stats-bar";

export type UploadedImage = {
  id: string; // image _id из Mongo
  url: string; // cloudinary url
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  blogId: string;
};

const renumberOrderedList = (value: string, cursor: number) => {
  const lines = value.split("\n");

  // определить индекс строки курсора
  let lineIndex = 0;
  let acc = 0;

  for (let i = 0; i < lines.length; i++) {
    acc += lines[i].length + 1;
    if (acc > cursor) {
      lineIndex = i;
      break;
    }
  }

  const isOl = (line: string) => /^\d+\.\s+/.test(line);

  // если текущая строка не OL — ищем ближайший OL выше
  let probe = lineIndex;
  while (probe >= 0 && !isOl(lines[probe])) {
    probe--;
  }

  if (probe < 0) return value;

  // найти начало списка
  let start = probe;
  while (start > 0 && isOl(lines[start - 1])) {
    start--;
  }

  // найти конец списка
  let end = probe;
  while (end < lines.length - 1 && isOl(lines[end + 1])) {
    end++;
  }

  // перенумерация
  let counter = 1;
  for (let i = start; i <= end; i++) {
    lines[i] = lines[i].replace(/^\d+\.\s+/, `${counter}. `);
    counter++;
  }

  return lines.join("\n");
};

export const MarkdownEditor = ({
  value,
  onChange,
  blogId,
  images,
  onImagesChange,
}: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const markdownStats = useMarkdownStats(value, textareaRef);
  const previewStats = usePreviewStats(previewRef, value);

  const toolbar = useMarkdownToolbar(textareaRef, value, onChange);

  const toggleTaskAtIndex = (index: number) => {
    const lines = value.split("\n");
    let current = -1;

    const next = lines.map((line) => {
      if (/^- \[[ x]\]/.test(line)) {
        current++;
        if (current === index) {
          return line.includes("[x]")
            ? line.replace("[x]", "[ ]")
            : line.replace("[ ]", "[x]");
        }
      }
      return line;
    });

    onChange(next.join("\n"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, value } = textarea;

    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const lineEnd =
      value.indexOf("\n", selectionStart) === -1
        ? value.length
        : value.indexOf("\n", selectionStart);

    const line = value.slice(lineStart, lineEnd);

    /* ================= BACKSPACE ================= */

    if (e.key === "Backspace") {
      const patterns = [/^- $/, /^- \[[ x]\] $/i, /^\d+\. $/];

      if (patterns.some((r) => r.test(line))) {
        e.preventDefault();

        const next = value.slice(0, lineStart) + value.slice(lineEnd + 1);
        const nextCursor = lineStart;

        onChange(renumberOrderedList(next, nextCursor));
      }
      return;
    }

    /* ================= ENTER ================= */

    if (e.key !== "Enter") return;

    // TASK LIST
    if (/^- \[[ x]\]\s*/i.test(line)) {
      e.preventDefault();

      if (!line.replace(/^-\s+\[[ x]\]\s*/, "").trim()) {
        const next = value.slice(0, lineStart) + value.slice(lineEnd + 1);
        onChange(renumberOrderedList(next, lineStart));
        return;
      }

      const insert = "\n- [ ] ";
      const next =
        value.slice(0, selectionStart) + insert + value.slice(selectionStart);

      onChange(next);

      requestAnimationFrame(() => {
        textarea.setSelectionRange(
          selectionStart + insert.length,
          selectionStart + insert.length,
        );
      });

      return;
    }

    // UL
    if (/^- /.test(line)) {
      e.preventDefault();

      if (!line.replace(/^- /, "").trim()) {
        const next = value.slice(0, lineStart) + value.slice(lineEnd + 1);
        onChange(next);
        return;
      }

      const insert = "\n- ";
      onChange(
        value.slice(0, selectionStart) + insert + value.slice(selectionStart),
      );
      return;
    }

    // OL
    if (/^\d+\.\s+/.test(line)) {
      e.preventDefault();

      if (!line.replace(/^\d+\.\s+/, "").trim()) {
        const next = value.slice(0, lineStart) + value.slice(lineEnd + 1);
        onChange(renumberOrderedList(next, lineStart));
        return;
      }

      const current = Number(line.match(/^(\d+)\./)?.[1] ?? 1);
      const insert = `\n${current + 1}. `;
      const next =
        value.slice(0, selectionStart) + insert + value.slice(selectionStart);

      onChange(next);
      return;
    }
  };

  const insertMarkdown = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    const next =
      value.slice(0, selectionStart) + snippet + value.slice(selectionEnd);

    onChange(next);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        selectionStart + snippet.length;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <MarkdownToolbar toolbar={toolbar} />

        <ImageUploader
          variant="editor"
          blogId={blogId}
          images={images}
          onImagesChange={onImagesChange}
          insertMarkdown={insertMarkdown}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={14}
          className="resize-none min-h-[300px]"
        />

        <div className="border rounded-md p-3 overflow-auto" ref={previewRef}>
          <MarkdownRenderer content={value} onToggleTask={toggleTaskAtIndex} />
        </div>
        <StatsBar markdown={markdownStats} preview={previewStats} />
      </div>
    </div>
  );
};
