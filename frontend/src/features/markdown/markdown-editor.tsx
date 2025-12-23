// features/markdown/ui/markdown-editor.tsx
import { useRef } from "react";
import { Textarea } from "@/shared/ui/kit/textarea";
import { MarkdownRenderer } from "./markdown-renderer";
import { MarkdownToolbar } from "./markdown-toolbar";
import { useMarkdownToolbar } from "./use-markdown-toolbar";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const MarkdownEditor = ({ value, onChange }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (e.key === "Backspace") {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const { selectionStart, value } = textarea;

      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const line = value.slice(lineStart, selectionStart);

      const patterns = [/^- $/, /^- \[[ x]\] $/i, /^\d+\. $/];

      if (patterns.some((r) => r.test(line))) {
        e.preventDefault();

        const next = value.slice(0, lineStart) + value.slice(selectionStart);

        onChange(next);
      }
    }

    if (e.key !== "Enter") return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, value } = textarea;

    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const lineEnd =
      value.indexOf("\n", selectionStart) === -1
        ? value.length
        : value.indexOf("\n", selectionStart);

    const line = value.slice(lineStart, lineEnd);

    // TASK LIST
    if (/^- \[[ x]\]\s*/i.test(line)) {
      e.preventDefault();

      if (!line.replace(/^-\s+\[[ x]\]\s*/, "").trim()) {
        // пустой task → выйти
        const next = value.slice(0, lineStart) + value.slice(lineEnd + 1);

        onChange(next);
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

        onChange(next);
        return;
      }

      const current = Number(line.match(/^(\d+)\./)?.[1] ?? 1);
      const insert = `\n${current + 1}. `;

      onChange(
        value.slice(0, selectionStart) + insert + value.slice(selectionStart),
      );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <MarkdownToolbar toolbar={toolbar} />

      <div className="grid grid-cols-2 gap-4">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={14}
          className="resize-none min-h-[300px]"
        />

        <div className="border rounded-md p-3 overflow-auto">
          <MarkdownRenderer content={value} onToggleTask={toggleTaskAtIndex} />
        </div>
      </div>
    </div>
  );
};
