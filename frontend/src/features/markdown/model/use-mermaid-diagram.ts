import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { initMermaid } from "../lib/mermaid";
import { useDebounce } from "@/shared/lib/hooks/use-debounce";

export const useMermaidDiagram = (code: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedCode = useDebounce(code, 300);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        initMermaid();
        setError(null);

        const id = `mermaid-${crypto.randomUUID()}`;

        const { svg } = await mermaid.render(id, debouncedCode);

        if (cancelled || !containerRef.current) return;

        containerRef.current.innerHTML = svg;
      } catch (err) {
        if (cancelled) return;

        console.error("Mermaid error:", err);
        setError("Diagram syntax error");
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [debouncedCode]);

  return {
    containerRef,
    error,
  };
};
