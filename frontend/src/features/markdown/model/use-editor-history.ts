import { useCallback, useRef, useState } from "react";

type HistoryEntry = {
  value: string;
  selection: {
    start: number;
    end: number;
  };
};

type Selection = {
  start: number;
  end: number;
};

type HistoryState = {
  past: HistoryEntry[];
  present: HistoryEntry;
  future: HistoryEntry[];
};

const MAX_HISTORY = 50;
const TYPING_MERGE_DELAY = 800; // ms

export const useEditorHistory = (initialValue: string) => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: {
      value: initialValue,
      selection: { start: 0, end: 0 },
    },
    future: [],
  });

  const lastTypingTimeRef = useRef<number>(0);
  const forceNewStepRef = useRef<boolean>(false);

  /* ================= helpers ================= */

  const pushToPast = (
    past: HistoryEntry[],
    entry: HistoryEntry,
  ): HistoryEntry[] => {
    const next = [...past, entry];
    return next.length > MAX_HISTORY ? next.slice(1) : next;
  };

  /* ================= set value ================= */

  const setValue = useCallback((nextValue: string, selection?: Selection) => {
    setHistory((current) => {
      const now = Date.now();
      const isTyping =
        !forceNewStepRef.current &&
        now - lastTypingTimeRef.current < TYPING_MERGE_DELAY;

      const nextSelection = selection ??
        current.present.selection ?? { start: 0, end: 0 };

      const nextEntry: HistoryEntry = {
        value: nextValue,
        selection: nextSelection,
      };

      const past = isTyping
        ? current.past
        : pushToPast(current.past, current.present);

      lastTypingTimeRef.current = now;
      forceNewStepRef.current = false;

      return {
        past,
        present: nextEntry,
        future: [], // любое новое изменение сбрасывает redo
      };
    });
  }, []);

  /* ================= undo / redo ================= */

  const undo = useCallback(() => {
    setHistory((current) => {
      if (current.past.length === 0) return current;

      const previous = current.past[current.past.length - 1];
      const newPast = current.past.slice(0, -1);

      return {
        past: newPast,
        present: previous,
        future: [current.present, ...current.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((current) => {
      if (current.future.length === 0) return current;

      const next = current.future[0];
      const newFuture = current.future.slice(1);

      return {
        past: [...current.past, current.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  /* ================= public api ================= */

  const markAction = () => {
    forceNewStepRef.current = true;
  };

  return {
    value: history.present.value,
    selection: history.present.selection,

    setValue,
    undo,
    redo,
    markAction,

    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};
