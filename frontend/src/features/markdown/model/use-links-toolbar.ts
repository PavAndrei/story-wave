import { useState } from "react";
import type { useMarkdownToolbar } from "./use-markdown-toolbar";

type Toolbar = ReturnType<typeof useMarkdownToolbar>;

export const useLinksToolbar = (toolbar: Toolbar) => {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const openLinkPopover = () => {
    const sel = toolbar.actions.getSelectionText();
    setLinkText(sel || "link");
    setLinkUrl("");
    setLinkOpen(true);
  };

  const insertLink = () => {
    toolbar.actions.insertLink(
      linkText || "link",
      linkUrl || "https://www.example.com",
    );
    setLinkOpen(false);
  };

  return {
    linkOpen,
    setLinkOpen,
    linkText,
    setLinkText,
    linkUrl,
    setLinkUrl,
    openLinkPopover,
    insertLink,
  };
};
