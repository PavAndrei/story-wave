import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/kit/popover";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";
import type { useMarkdownToolbar } from "../model/use-markdown-toolbar";
import { useLinksToolbar } from "../model/use-links-toolbar";
import { useTablesToolbar } from "../model/use-tables-toolbar";

type Props = {
  toolbar: ReturnType<typeof useMarkdownToolbar>;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onImport: () => void;
  onExport: () => void;
  handleExportHtml: () => void;
  handleExportPdf: () => void;
};

export const MarkdownToolbar = ({
  toolbar,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onImport,
  onExport,
  handleExportHtml,
  handleExportPdf,
}: Props) => {
  const {
    insertLink,
    linkOpen,
    linkText,
    linkUrl,
    openLinkPopover,
    setLinkOpen,
    setLinkText,
    setLinkUrl,
  } = useLinksToolbar(toolbar);
  const {
    insertTable,
    tableOpen,
    tableRows,
    tableCols,
    setTableOpen,
    setTableRows,
    setTableCols,
  } = useTablesToolbar(toolbar);

  if (!toolbar) return null;

  const { actions, state } = toolbar;

  const btn = (active?: boolean) =>
    `px-2 py-1 rounded ${active ? "bg-primary text-white" : "bg-muted"}`;

  return (
    <div className="flex gap-1 p-2 border rounded">
      {/* undo / redo */}
      <button
        type="button"
        className={btn(canUndo)}
        disabled={!canUndo}
        onMouseDown={(e) => {
          e.preventDefault();
          onUndo();
        }}
      >
        ↶
      </button>

      <button
        type="button"
        className={btn(canRedo)}
        disabled={!canRedo}
        onMouseDown={(e) => {
          e.preventDefault();
          onRedo();
        }}
      >
        ↷
      </button>

      <span>|</span>

      {/* import / export */}
      <button
        type="button"
        className={btn()}
        onMouseDown={(e) => {
          e.preventDefault();
          onImport();
        }}
      >
        📥
      </button>
      <button
        type="button"
        className={btn()}
        onMouseDown={(e) => {
          e.preventDefault();
          onExport();
        }}
      >
        📤
      </button>

      <span>|</span>

      <button
        type="button"
        className={btn()}
        onMouseDown={(e) => {
          e.preventDefault();
          handleExportHtml();
        }}
      >
        🌐
      </button>
      <button
        type="button"
        className={btn()}
        onMouseDown={(e) => {
          e.preventDefault();
          handleExportPdf();
        }}
      >
        📄
      </button>

      <span>|</span>

      {/* formatting */}
      <button
        type="button"
        className={btn(state.bold)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.bold();
        }}
      >
        B
      </button>
      <button
        type="button"
        className={btn(state.italic)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.italic();
        }}
      >
        I
      </button>
      <button
        type="button"
        className={btn(state.strike)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.strike();
        }}
      >
        S
      </button>

      <span>|</span>

      {/* headings */}
      <button
        type="button"
        className={btn(state.h1)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.h1();
        }}
      >
        H1
      </button>
      <button
        type="button"
        className={btn(state.h2)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.h2();
        }}
      >
        H2
      </button>
      <button
        type="button"
        className={btn(state.h3)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.h3();
        }}
      >
        H3
      </button>

      <span>|</span>

      {/* lists */}
      <button
        type="button"
        className={btn(state.ul)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.ul();
        }}
      >
        •
      </button>
      <button
        type="button"
        className={btn(state.ol)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.ol();
        }}
      >
        1.
      </button>
      <button
        type="button"
        className={btn(state.task)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.task();
        }}
      >
        ☑
      </button>

      <button
        type="button"
        className={btn(state.code)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.code();
        }}
      >
        {"</>"}
      </button>
      <button
        type="button"
        className={btn(state.quote)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.quote();
        }}
      >
        ❝
      </button>

      {/* LINK POPOVER */}
      <Popover open={linkOpen} onOpenChange={setLinkOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={btn()}
            onClick={(e) => {
              e.preventDefault();
              openLinkPopover();
            }}
          >
            🔗
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-72 space-y-3">
          <Input
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
          <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />

          <Button
            type="button"
            size="sm"
            className="w-full"
            onMouseDown={(e) => {
              e.preventDefault();
              insertLink();
            }}
          >
            Insert link
          </Button>
        </PopoverContent>
      </Popover>

      {/* TABLE POPOVER */}
      <Popover open={tableOpen} onOpenChange={setTableOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            className={btn()}
            onClick={(e) => {
              e.preventDefault();
              setTableOpen(true);
            }}
          >
            📊
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 space-y-3">
          <Input
            type="number"
            value={tableRows}
            onChange={(e) => setTableRows(+e.target.value)}
          />
          <Input
            type="number"
            value={tableCols}
            onChange={(e) => setTableCols(+e.target.value)}
          />

          <Button
            type="button"
            size="sm"
            className="w-full"
            onMouseDown={(e) => {
              e.preventDefault();
              insertTable();
            }}
          >
            Insert table
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
