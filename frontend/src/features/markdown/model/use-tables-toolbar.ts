import { useState } from "react";
import type { useMarkdownToolbar } from "./use-markdown-toolbar";

type Toolbar = ReturnType<typeof useMarkdownToolbar>;

export const useTablesToolbar = (toolbar: Toolbar) => {
  const [tableOpen, setTableOpen] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(2);

  const insertTable = () => {
    toolbar.actions.insertTable(tableRows, tableCols);
    setTableOpen(false);
  };

  return {
    tableOpen,
    setTableOpen,
    tableRows,
    setTableRows,
    tableCols,
    setTableCols,
    insertTable,
  };
};
