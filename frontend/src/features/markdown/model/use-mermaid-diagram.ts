import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { initMermaid } from "../lib/mermaid";

export const useMermaidDiagram = (code: string) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        initMermaid();
        setError(null);

        const id = `mermaid-${crypto.randomUUID()}`;

        const { svg } = await mermaid.render(id, code);

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
  }, [code]);

  return {
    containerRef,
    error,
  };
};
