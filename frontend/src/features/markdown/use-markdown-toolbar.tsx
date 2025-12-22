// features/markdown/model/use-markdown-toolbar.ts

import type { RefObject } from "react";

type ApplyFn = (next: string) => void;
type ListType = "ul" | "ol";

export const useMarkdownToolbar = (
  textareaRef: RefObject<HTMLTextAreaElement>,
  apply: ApplyFn,
) => {
  /* ================= helpers ================= */

  const getCtx = () => {
    const textarea = textareaRef.current;
    if (!textarea) return null;

    const { selectionStart, selectionEnd, value } = textarea;

    return { textarea, selectionStart, selectionEnd, value };
  };

  const restoreSelection = (
    textarea: HTMLTextAreaElement,
    start: number,
    end: number,
  ) => {
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, end);
    });
  };

  const getCurrentLine = (value: string, pos: number) => {
    const start = value.lastIndexOf("\n", pos - 1) + 1;
    const end =
      value.indexOf("\n", pos) === -1 ? value.length : value.indexOf("\n", pos);

    return { start, end, text: value.slice(start, end) };
  };

  /* ================= inline toggle ================= */

  const toggleInline = (
    wrapperStart: string,
    wrapperEnd: string = wrapperStart,
  ) => {
    const ctx = getCtx();
    if (!ctx) return;

    const { textarea, selectionStart, selectionEnd, value } = ctx;

    const from = selectionStart;
    const to = selectionEnd;

    if (from === to) return;

    const selected = value.slice(from, to);
    const before = value.slice(0, from);
    const after = value.slice(to);

    const hasWrapper =
      before.endsWith(wrapperStart) && after.startsWith(wrapperEnd);

    if (hasWrapper) {
      const next =
        before.slice(0, -wrapperStart.length) +
        selected +
        after.slice(wrapperEnd.length);

      apply(next);
      restoreSelection(
        textarea,
        from - wrapperStart.length,
        to - wrapperStart.length,
      );
      return;
    }

    const next = before + wrapperStart + selected + wrapperEnd + after;

    apply(next);
    restoreSelection(
      textarea,
      from + wrapperStart.length,
      to + wrapperStart.length,
    );
  };

  /* ================= headings ================= */

  const toggleHeading = (level: 1 | 2 | 3) => {
    const ctx = getCtx();
    if (!ctx) return;

    const { textarea, selectionStart, value } = ctx;
    const { start, end, text } = getCurrentLine(value, selectionStart);

    const headingRegex = /^(#{1,6})\s+/;
    const current = text.match(headingRegex)?.[1]?.length;

    let nextLine = text;

    if (current === level) {
      // toggle OFF
      nextLine = text.replace(headingRegex, "");
    } else {
      // replace or add
      nextLine = `${"#".repeat(level)} ${text.replace(headingRegex, "")}`;
    }

    const next = value.slice(0, start) + nextLine + value.slice(end);

    apply(next);
    restoreSelection(textarea, start, start + nextLine.length);
  };

  /* ================= lists ================= */

  const toggleList = (type: ListType) => {
    const ctx = getCtx();
    if (!ctx) return;

    const { textarea, selectionStart, value } = ctx;
    const { start, end, text } = getCurrentLine(value, selectionStart);

    const ulRegex = /^-\s+/;
    const olRegex = /^\d+\.\s+/;

    const isUl = ulRegex.test(text);
    const isOl = olRegex.test(text);

    let nextLine = text.replace(ulRegex, "").replace(olRegex, "");

    if ((type === "ul" && isUl) || (type === "ol" && isOl)) {
      // toggle OFF
    } else {
      nextLine = type === "ul" ? `- ${nextLine}` : `1. ${nextLine}`;
    }

    const next = value.slice(0, start) + nextLine + value.slice(end);

    apply(next);
    restoreSelection(textarea, start, start + nextLine.length);
  };

  /* ================= active state ================= */

  const getActiveState = () => {
    const ctx = getCtx();
    if (!ctx) return {};

    const { selectionStart, value } = ctx;
    const { text } = getCurrentLine(value, selectionStart);

    return {
      bold: /\*\*.+\*\*/.test(text),
      italic: /_.+_/.test(text),
      strike: /~~.+~~/.test(text),
      code: /`.+`/.test(text),

      h1: text.startsWith("# "),
      h2: text.startsWith("## "),
      h3: text.startsWith("### "),

      ul: text.startsWith("- "),
      ol: /^\d+\.\s+/.test(text),
    };
  };

  /* ================= public api ================= */

  return {
    actions: {
      bold: () => toggleInline("**"),
      italic: () => toggleInline("_"),
      strike: () => toggleInline("~~"),
      code: () => toggleInline("`"),

      h1: () => toggleHeading(1),
      h2: () => toggleHeading(2),
      h3: () => toggleHeading(3),

      ul: () => toggleList("ul"),
      ol: () => toggleList("ol"),
    },

    state: getActiveState(),
  };
};
