import { useCallback, useRef, useState } from "react";

type HistoryState = {
  past: string[];
  present: string;
  future: string[];
};

const MAX_HISTORY = 50;
const TYPING_MERGE_DELAY = 800; // ms

export const useEditorHistory = (initialValue: string) => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialValue,
    future: [],
  });

  const lastTypingTimeRef = useRef<number>(0);
  const forceNewStepRef = useRef<boolean>(false);

  /* ================= helpers ================= */

  const pushToPast = (past: string[], value: string) => {
    const next = [...past, value];
    return next.length > MAX_HISTORY ? next.slice(1) : next;
  };

  /* ================= set value ================= */

  const setValue = useCallback((nextValue: string) => {
    setHistory((current) => {
      const now = Date.now();
      const isTyping =
        !forceNewStepRef.current &&
        now - lastTypingTimeRef.current < TYPING_MERGE_DELAY;

      const past = isTyping
        ? current.past
        : pushToPast(current.past, current.present);

      lastTypingTimeRef.current = now;
      forceNewStepRef.current = false;

      return {
        past,
        present: nextValue,
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
    value: history.present,
    setValue,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    markAction,
  };
};
