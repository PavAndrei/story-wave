import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { initMermaid } from "./mermaid";

type Props = {
  code: string;
};

export const MermaidDiagram = ({ code }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const render = async () => {
      initMermaid();
      setError(null);
      containerRef.current!.innerHTML = "";
      try {
        const id = `mermaid-${crypto.randomUUID()}`;
        const { svg } = await mermaid.render(id, code);

        containerRef.current!.innerHTML = svg;
      } catch (err) {
        console.error("Mermaid error:", err);
        setError("Diagram syntax error. Please check your Mermaid definition.");
      }
    };

    render();
  }, [code]);

  if (error) {
    return (
      <div className="my-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
        <div className="font-medium mb-1">Mermaid diagram error</div>
        <div className="opacity-80">{error}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mermaid-diagram overflow-auto my-4" />
  );
};
