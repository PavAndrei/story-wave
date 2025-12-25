// features/markdown/markdown-editor.tsx
import { useEffect, useRef } from "react";
import { Textarea } from "@/shared/ui/kit/textarea";
import { MarkdownRenderer } from "./markdown-renderer";
import { MarkdownToolbar } from "./markdown-toolbar";
import { useMarkdownToolbar } from "./use-markdown-toolbar";
import { ImageUploader } from "../uploads";
import { useMarkdownStats } from "./use-markdown-stats";
import { usePreviewStats } from "./use-preview-stats";
import { StatsBar } from "./stats-bar";
import { useEditorHistory } from "./use-editor-history";
import { exportMarkdown, importMarkdownFile } from "./import-export";
import { exportHtml } from "./export-html";
import { exportPdf } from "./export-pdf";
import { getExportFilename } from "./filename";
import { renumberOrderedList } from "./renumber-ordered-list";

export type UploadedImage = {
  id: string; // image _id из Mongo
  url: string; // cloudinary url
};

type Props = {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  blogId: string;
  title?: string;
  value: string;
  onChange: (value: string) => void;
};

export const MarkdownEditor = ({
  blogId,
  images,
  onImagesChange,
  title,
  value,
  onChange,
}: Props) => {
  // refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // history
  const history = useEditorHistory(value);

  useEffect(() => {
    if (history.value !== value) {
      history.markAction();
    }
  }, [value]);

  const applyChange = (next: string, mark = false) => {
    if (mark) history.markAction();
    history.setValue(next);
    onChange(next);
  };

  // imports & exports
  const filename = getExportFilename(history.value || "", {
    title: title?.trim() || "",
    fallbackId: blogId,
  });
  const handleExport = () => {
    exportMarkdown(history.value, `${filename}.md`);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".md";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const content = await importMarkdownFile(file);
        applyChange(content, true);
      } catch (err) {
        alert((err as Error).message);
      }
    };

    input.click();
  };

  const handleExportHtml = () => {
    if (!previewRef.current) return;
    exportHtml(previewRef.current.innerHTML, `${filename}.html`);
  };

  const handleExportPdf = () => {
    if (!previewRef.current) return;
    exportPdf(previewRef.current.innerHTML);
  };

  const markdownStats = useMarkdownStats(value, textareaRef);
  const previewStats = usePreviewStats(previewRef, value);

  const toolbar = useMarkdownToolbar(textareaRef, value, (next) =>
    applyChange(next, true),
  );

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

    /* ================= UNDO / REDO ================= */

    const isMod = e.ctrlKey || e.metaKey;

    // Undo
    if (isMod && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      history.undo();

      requestAnimationFrame(() => {
        onChange(history.value);
      });
    }

    if (isMod && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      history.undo();

      requestAnimationFrame(() => {
        onChange(history.value);
      });
    }

    /* ================= BACKSPACE ================= */

    if (e.key === "Backspace") {
      const patterns = [/^- $/, /^- \[[ x]\] $/i, /^\d+\. $/];

      if (patterns.some((r) => r.test(line))) {
        e.preventDefault();

        const next = value.slice(0, lineStart) + value.slice(lineEnd + 1);
        const nextCursor = lineStart;

        applyChange(renumberOrderedList(next, nextCursor), true);
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

      applyChange(next, true);

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

    applyChange(next, true);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        selectionStart + snippet.length;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <MarkdownToolbar
          toolbar={toolbar}
          onUndo={() => {
            history.undo();
            requestAnimationFrame(() => onChange(history.value));
          }}
          onRedo={() => {
            history.redo();
            requestAnimationFrame(() => onChange(history.value));
          }}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onImport={handleImport}
          onExport={handleExport}
          handleExportHtml={handleExportHtml}
          handleExportPdf={handleExportPdf}
        />

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
          onChange={(e) => applyChange(e.target.value)}
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
