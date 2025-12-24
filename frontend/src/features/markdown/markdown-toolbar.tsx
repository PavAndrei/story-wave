// features/markdown/markdown-toolbar.tsx

import { useState } from "react";
import type { useMarkdownToolbar } from "./use-markdown-toolbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/kit/popover";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";

type Props = {
  toolbar: ReturnType<typeof useMarkdownToolbar>;
};

export const MarkdownToolbar = ({ toolbar }: Props) => {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const [tableOpen, setTableOpen] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);

  if (!toolbar) return null;

  const { actions, state } = toolbar;

  const btn = (active?: boolean) =>
    `px-2 py-1 rounded ${active ? "bg-primary text-white" : "bg-muted"}`;

  /* ================= LINK ================= */

  const openLinkPopover = () => {
    const sel = actions.getSelectionText();
    setLinkText(sel || "link");
    setLinkUrl("");
    setLinkOpen(true);
  };

  return (
    <div className="flex gap-1 p-2 border rounded">
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

      <button
        type="button"
        className={btn()}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.insertDiagram();
        }}
      >
        📈
      </button>

      {/* ================= LINK POPOVER ================= */}

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
            placeholder="Text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />

          <Input
            placeholder="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />

          <Button
            size="sm"
            className="w-full"
            onMouseDown={(e) => {
              e.preventDefault();
              actions.insertLink(
                linkText || "link",
                linkUrl || "https://www.example.com",
              );
              setLinkOpen(false);
            }}
          >
            Insert link
          </Button>
        </PopoverContent>
      </Popover>

      <Popover open={tableOpen} onOpenChange={setTableOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={btn()}
            onClick={(e) => {
              e.preventDefault();
              setTableOpen(true);
            }}
          >
            📊
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-64 space-y-3">
          <Input
            type="number"
            min={1}
            max={20}
            placeholder="Rows"
            value={tableRows}
            onChange={(e) => setTableRows(Number(e.target.value))}
          />

          <Input
            type="number"
            min={1}
            max={10}
            placeholder="Columns"
            value={tableCols}
            onChange={(e) => setTableCols(Number(e.target.value))}
          />

          <Button
            size="sm"
            className="w-full"
            onMouseDown={(e) => {
              e.preventDefault();
              actions.insertTable(tableRows, tableCols);
              setTableOpen(false);
            }}
          >
            Insert table
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
