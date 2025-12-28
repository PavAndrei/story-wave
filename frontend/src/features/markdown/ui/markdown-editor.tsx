// features/markdown/markdown-editor.tsx
import { Textarea } from "@/shared/ui/kit/textarea";
import { MarkdownRenderer } from "./markdown-renderer";
import { ImageUploader } from "../../uploads";
import { useMarkdownStats } from "../model/use-markdown-stats";
import { usePreviewStats } from "../model/use-preview-stats";
import { StatsBar } from "./stats-bar";
import { MarkdownToolbar } from "./markdown-toolbar";
import { useMarkdownEditor } from "../model/use-markdown-editor";

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
  const {
    textareaRef,
    previewRef,
    toolbar,
    insertMarkdown,
    handleKeyDown,
    history,
    handleImport,
    handleExport,
    handleExportHtml,
    handleExportPdf,
    toggleTaskAtIndex,
    applyChange,
  } = useMarkdownEditor({
    value,
    onChange,
    title,
    blogId,
  });

  const markdownStats = useMarkdownStats(value, textareaRef);
  const previewStats = usePreviewStats(previewRef, value);

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
          <MarkdownRenderer
            content={history.value}
            onToggleTask={toggleTaskAtIndex}
          />
        </div>
        <StatsBar markdown={markdownStats} preview={previewStats} />
      </div>
    </div>
  );
};
