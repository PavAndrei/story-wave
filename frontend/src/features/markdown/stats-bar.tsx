type MarkdownStats = {
  bytes: number;
  words: number;
  lines: number;
  line: number;
  column: number;
};

type PreviewStats = {
  characters: number;
  words: number;
  paragraphs: number;
};

type StatsBarProps = {
  markdown: MarkdownStats;
  preview: PreviewStats;
};

export const StatsBar = ({ markdown, preview }: StatsBarProps) => {
  return (
    <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
      {/* Markdown stats */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-medium text-foreground">Markdown</span>

        <span>{markdown.bytes} bytes</span>
        <span>{markdown.words} words</span>
        <span>{markdown.lines} lines</span>

        <span className="text-muted-foreground/70">
          Ln {markdown.line}, Col {markdown.column}
        </span>
      </div>

      {/* Preview stats */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-medium text-foreground">HTML</span>

        <span>{preview.characters} characters</span>
        <span>{preview.words} words</span>
        <span>{preview.paragraphs} paragraphs</span>
      </div>
    </div>
  );
};
