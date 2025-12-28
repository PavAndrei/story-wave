// features/markdown/markdown-editor.tsx
import { useEffect, useRef } from "react";
import { Textarea } from "@/shared/ui/kit/textarea";
import { MarkdownRenderer } from "./markdown-renderer";
import { useMarkdownToolbar } from "../model/use-markdown-toolbar";
import { ImageUploader } from "../../uploads";
import { useMarkdownStats } from "../model/use-markdown-stats";
import { usePreviewStats } from "../model/use-preview-stats";
import { StatsBar } from "./stats-bar";
import { useEditorHistory } from "../model/use-editor-history";
import { exportMarkdown, importMarkdownFile } from "../services/import-export";
import { exportHtml } from "../services/export-html";
import { exportPdf } from "../services/export-pdf";
import { getExportFilename } from "../lib/filename";
import { renumberOrderedList } from "../lib/renumber-ordered-list";
import { MarkdownToolbar } from "./markdown-toolbar";

export type UploadedImage = {
  id: string; // image _id из Mongo
  url: string; // cloudinary url
};

export type ApplyPayload = {
  value: string;
  selection?: { start: number; end: number };
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

  const applyChange = (payload: ApplyPayload, mark = false) => {
    if (mark) history.markAction();

    history.setValue(payload.value, payload.selection);
    onChange(payload.value);
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
        applyChange(
          {
            value: content,
            selection: { start: 0, end: 0 },
          },
          true,
        );
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

  const toolbar = useMarkdownToolbar(textareaRef, value, (payload) =>
    applyChange(payload, true),
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

    applyChange({
      value: next.join("\n"),
    });
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
    }

    /* ================= BACKSPACE ================= */

    if (e.key === "Backspace") {
      const patterns = [/^- $/, /^- \[[ x]\] $/i, /^\d+\. $/];

      if (patterns.some((r) => r.test(line))) {
        e.preventDefault();

        const next = value.slice(0, lineStart) + value.slice(lineEnd + 1);
        const nextCursor = lineStart;

        applyChange(
          {
            value: renumberOrderedList(next, nextCursor),
            selection: { start: nextCursor, end: nextCursor },
          },
          true,
        );
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

      applyChange(
        {
          value: next,
          selection: {
            start: selectionStart + insert.length,
            end: selectionStart + insert.length,
          },
        },
        true,
      );

      return;
    }

    // UL
    if (/^- /.test(line)) {
      e.preventDefault();

      if (!line.replace(/^- /, "").trim()) {
        const next = value.slice(0, lineStart) + value.slice(lineEnd + 1);
        applyChange(
          {
            value: renumberOrderedList(next, lineStart),
            selection: {
              start: lineStart,
              end: lineStart,
            },
          },
          true,
        );

        return;
      }

      const insert = "\n- ";
      const next =
        value.slice(0, selectionStart) + insert + value.slice(selectionStart);

      applyChange(
        {
          value: next,
          selection: {
            start: selectionStart + insert.length,
            end: selectionStart + insert.length,
          },
        },
        true,
      );
      return;
    }

    // OL
    if (/^\d+\.\s+/.test(line)) {
      e.preventDefault();

      if (!line.replace(/^\d+\.\s+/, "").trim()) {
        const current = Number(line.match(/^(\d+)\./)?.[1] ?? 1);
        const insert = `\n${current + 1}. `;
        const next =
          value.slice(0, selectionStart) + insert + value.slice(selectionStart);

        applyChange(
          {
            value: next,
            selection: {
              start: selectionStart + insert.length,
              end: selectionStart + insert.length,
            },
          },
          true,
        );

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

    const nextValue =
      value.slice(0, selectionStart) + snippet + value.slice(selectionEnd);

    const cursor = selectionStart + snippet.length;

    applyChange(
      {
        value: nextValue,
        selection: {
          start: cursor,
          end: cursor,
        },
      },
      true,
    );
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selection } = history;
    if (!selection) return;

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selection.start, selection.end);
    });
  }, [history.value]);

  useEffect(() => {
    onChange(history.value);
  }, [history.value]);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <MarkdownToolbar
          toolbar={toolbar}
          onUndo={() => history.undo()}
          onRedo={() => history.redo()}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          onImport={handleImport}
          onExport={handleExport}
          handleExportHtml={handleExportHtml}
          handleExportPdf={handleExportPdf}
        />

        <ImageUploader
          blogId={blogId}
          images={images}
          onImagesChange={onImagesChange}
          insertMarkdown={insertMarkdown}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Textarea
          ref={textareaRef}
          value={history.value}
          onChange={(e) =>
            applyChange({
              value: e.target.value,
              selection: {
                start: e.target.selectionStart ?? 0,
                end: e.target.selectionEnd ?? 0,
              },
            })
          }
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
