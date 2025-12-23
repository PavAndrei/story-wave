// features/markdown/model/use-markdown-toolbar.ts

import type { RefObject } from "react";

type ApplyFn = (next: string) => void;
type ListType = "ul" | "ol";

export const useMarkdownToolbar = (
  textareaRef: RefObject<HTMLTextAreaElement>,
  value: string,
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
    placeholder = "text",
  ) => {
    const ctx = getCtx();
    if (!ctx) return;

    const { textarea, selectionStart, selectionEnd, value } = ctx;

    const from = selectionStart;
    const to = selectionEnd;

    if (from === to) {
      const insert = `${wrapperStart}${placeholder}${wrapperEnd}`;
      const next = value.slice(0, from) + insert + value.slice(from);

      apply(next);

      restoreSelection(
        textarea,
        from + wrapperStart.length,
        from + wrapperStart.length + placeholder.length,
      );
      return;
    }

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

  const toggleQuote = () => {
    const ctx = getCtx();
    if (!ctx) return;

    const { textarea, selectionStart, value } = ctx;
    const { start, end, text } = getCurrentLine(value, selectionStart);

    if (!text.trim()) {
      const insert = "> quote text";
      const next = value.slice(0, start) + insert + value.slice(end);

      apply(next);
      restoreSelection(textarea, start + 2, start + insert.length);
      return;
    }

    const isQuote = /^>\s+/.test(text);
    const nextLine = isQuote ? text.replace(/^>\s+/, "") : `> ${text}`;

    const next = value.slice(0, start) + nextLine + value.slice(end);
    apply(next);
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

    const { textarea, selectionStart, selectionEnd, value } = ctx;

    if (selectionStart === selectionEnd) {
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const lineEnd =
        value.indexOf("\n", selectionStart) === -1
          ? value.length
          : value.indexOf("\n", selectionStart);

      const line = value.slice(lineStart, lineEnd);

      if (!line.trim()) {
        const insert = type === "ul" ? "- " : "1. ";

        const next = value.slice(0, lineStart) + insert + value.slice(lineEnd);

        apply(next);

        restoreSelection(
          textarea,
          lineStart + insert.length,
          lineStart + insert.length,
        );

        return;
      }
    }

    const ulRegex = /^-\s+/;
    const olRegex = /^\d+\.\s+/;

    // 1. Определяем границы блока
    const blockStart = value.lastIndexOf("\n", selectionStart - 1) + 1;

    const endLineBreak = value.indexOf("\n", selectionEnd);
    const blockEnd = endLineBreak === -1 ? value.length : endLineBreak;

    const block = value.slice(blockStart, blockEnd);
    const lines = block.split("\n");

    const isUl = lines.every((l) => !l.trim() || ulRegex.test(l));
    const isOl = lines.every((l) => !l.trim() || olRegex.test(l));

    // 2. Определяем трансформацию
    let transformed: string[];

    if ((type === "ul" && isUl) || (type === "ol" && isOl)) {
      // toggle OFF
      transformed = lines.map((l) =>
        l.replace(ulRegex, "").replace(olRegex, ""),
      );
    } else {
      // replace / apply
      transformed = lines.map((l, i) => {
        if (!l.trim()) return l;

        const content = l.replace(ulRegex, "").replace(olRegex, "");
        return type === "ul" ? `- ${content}` : `${i + 1}. ${content}`;
      });
    }

    const next =
      value.slice(0, blockStart) +
      transformed.join("\n") +
      value.slice(blockEnd);

    apply(next);

    restoreSelection(
      textarea,
      blockStart,
      blockStart + transformed.join("\n").length,
    );
  };

  const toggleTaskList = () => {
    const ctx = getCtx();
    if (!ctx) return;

    const { textarea, selectionStart, selectionEnd, value } = ctx;

    // CASE: пустая строка + нет выделения
    if (selectionStart === selectionEnd) {
      const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
      const lineEnd =
        value.indexOf("\n", selectionStart) === -1
          ? value.length
          : value.indexOf("\n", selectionStart);

      const line = value.slice(lineStart, lineEnd);

      if (!line.trim()) {
        const insert = "- [ ] check-me";

        const next = value.slice(0, lineStart) + insert + value.slice(lineEnd);

        apply(next);

        restoreSelection(
          textarea,
          lineStart + insert.length,
          lineStart + insert.length,
        );

        return;
      }
    }

    const taskUnchecked = /^-\s+\[ \]\s+/;
    // const taskChecked = /^-\s+\[x\]\s+/i;
    const taskAny = /^-\s+\[[ x]\]\s+/i;

    // границы блока
    const blockStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const endLineBreak = value.indexOf("\n", selectionEnd);
    const blockEnd = endLineBreak === -1 ? value.length : endLineBreak;

    const block = value.slice(blockStart, blockEnd);
    const lines = block.split("\n");

    const isTaskList = lines.every((l) => !l.trim() || taskAny.test(l));

    let transformed: string[];

    if (isTaskList) {
      // если все unchecked → делаем checked
      const allUnchecked = lines.every(
        (l) => !l.trim() || taskUnchecked.test(l),
      );

      if (allUnchecked) {
        transformed = lines.map((l) => l.replace(taskUnchecked, "- [x] "));
      } else {
        // иначе снимаем task-разметку
        transformed = lines.map((l) => l.replace(taskAny, ""));
      }
    } else {
      // превращаем в task list
      transformed = lines.map((l) => {
        if (!l.trim()) return l;

        const content = l.replace(/^-\s+/, "").replace(/^\d+\.\s+/, "");

        return `- [ ] ${content}`;
      });
    }

    const next =
      value.slice(0, blockStart) +
      transformed.join("\n") +
      value.slice(blockEnd);

    apply(next);

    restoreSelection(
      textarea,
      blockStart,
      blockStart + transformed.join("\n").length,
    );
  };

  /* ================= active state ================= */

  const getActiveState = () => {
    const textarea = textareaRef.current;
    if (!textarea) return {};

    const pos = textarea.selectionStart;
    const { text } = getCurrentLine(value, pos);

    const taskAny = /^-\s+\[[ x]\]\s+/i;
    const taskChecked = /^-\s+\[x\]\s+/i;
    return {
      bold: /\*\*.+\*\*/.test(text),
      italic: /_.+_/.test(text),
      strike: /~~.+~~/.test(text),
      code: /`.+`/.test(text),

      h1: /^#\s+/.test(text),
      h2: /^##\s+/.test(text),
      h3: /^###\s+/.test(text),

      ul: /^-\s+/.test(text),
      ol: /^\d+\.\s+/.test(text),

      task: taskAny.test(text),
      taskChecked: taskChecked.test(text),
    };
  };

  const insertLink = (text: string, url: string) => {
    const ctx = getCtx();
    if (!ctx) return;

    const { textarea, selectionStart, selectionEnd, value } = ctx;

    const insert =
      selectionStart !== selectionEnd
        ? `[${text}](${url})`
        : `[${text}](${url})`;

    const start = selectionStart;
    const end = selectionEnd;

    const next = value.slice(0, start) + insert + value.slice(end);

    apply(next);

    const cursor = start + insert.length;
    restoreSelection(textarea, cursor, cursor);
  };

  const insertImage = (alt: string, url: string) => {
    const ctx = getCtx();
    if (!ctx) return;

    const { textarea, selectionStart, value } = ctx;

    const insert = `![${alt}](${url})`;

    const next =
      value.slice(0, selectionStart) + insert + value.slice(selectionStart);

    apply(next);

    const cursor = selectionStart + insert.length;
    restoreSelection(textarea, cursor, cursor);
  };

  const getSelectionText = () => {
    const ctx = getCtx();
    if (!ctx) return "";
    return ctx.value.slice(ctx.selectionStart, ctx.selectionEnd);
  };

  /* ================= public api ================= */

  return {
    actions: {
      bold: () => toggleInline("**", "**", "strong text"),
      italic: () => toggleInline("_", "_", "italic text"),
      strike: () => toggleInline("~~", "~~", "striked text"),
      code: () => toggleInline("`", "`", "code"),

      quote: () => toggleQuote(),

      h1: () => toggleHeading(1),
      h2: () => toggleHeading(2),
      h3: () => toggleHeading(3),

      ul: () => toggleList("ul"),
      ol: () => toggleList("ol"),

      task: () => toggleTaskList(),

      insertLink,
      insertImage,

      getSelectionText,
    },

    state: getActiveState(),
  };
};
