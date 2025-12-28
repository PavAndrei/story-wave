import { useEffect, useRef } from "react";
import { useEditorHistory } from "./use-editor-history";
import type { ApplyPayload } from "../ui/markdown-editor";
import { getExportFilename } from "../lib/filename";
import { exportMarkdown, importMarkdownFile } from "../services/import-export";
import { useMarkdownToolbar } from "./use-markdown-toolbar";
import { exportHtml } from "../services/export-html";
import { exportPdf } from "../services/export-pdf";
import { renumberOrderedList } from "../lib/renumber-ordered-list";

export const useMarkdownEditor = ({
  value,
  onChange,
  title,
  blogId,
}: {
  value: string;
  onChange: (value: string) => void;
  title?: string;
  blogId: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const history = useEditorHistory(value);

  const applyChange = (payload: ApplyPayload, mark = false) => {
    if (mark) history.markAction();

    history.setValue(payload.value, payload.selection);
    onChange(payload.value);
  };

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

      const content = await importMarkdownFile(file);
      applyChange(
        {
          value: content,
          selection: { start: 0, end: 0 },
        },
        true,
      );
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

  const toolbar = useMarkdownToolbar(textareaRef, value, (payload) =>
    applyChange(payload, true),
  );

  const toggleTaskAtIndex = (index: number) => {
    const lines = history.value.split("\n");
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
    applyChange({ value: next.join("\n") });
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

  return {
    textareaRef,
    previewRef,
    value: history.value,
    toolbar,
    history,
    applyChange,
    handleKeyDown,
    insertMarkdown,
    toggleTaskAtIndex,
    handleImport,
    handleExport,
    handleExportHtml,
    handleExportPdf,
  };
};
