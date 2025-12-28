import { useMermaidDiagram } from "../model/use-mermaid-diagram";

type Props = {
  code: string;
};

export const MermaidDiagram = ({ code }: Props) => {
  const { containerRef, error } = useMermaidDiagram(code);

  if (error) {
    return (
      <div className="my-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
        <div className="font-medium mb-1">Mermaid diagram error</div>
        <div className="opacity-80">{error}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mermaid-diagram my-4 overflow-auto" />
  );
};
