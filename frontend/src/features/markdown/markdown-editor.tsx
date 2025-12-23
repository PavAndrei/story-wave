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
  return (
    <div className="flex flex-col gap-3">
      <MarkdownToolbar toolbar={toolbar} />

      <div className="grid grid-cols-2 gap-4">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={14}
          className="resize-none min-h-[300px]"
        />

        <div className="border rounded-md p-3 overflow-auto">
          <MarkdownRenderer content={value} />
        </div>
      </div>
    </div>
  );
};
