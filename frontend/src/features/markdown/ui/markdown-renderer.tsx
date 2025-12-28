// features/markdown/markdown-renderer.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type MarkdownRendererProps = {
  content: string;
  onToggleTask: (lineIndex: number) => void;
};

export const MarkdownRenderer = ({
  content,
  onToggleTask,
}: MarkdownRendererProps) => {
  const taskLineIndices = content
    .split("\n")
    .map((line, index) => (/- \[[ x]\]/i.test(line) ? index : null))
    .filter((v): v is number => v !== null);

  let taskPointer = 0;

  return (
    <div className="markdown prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        skipHtml
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-6 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>
          ),
          p: ({ children }) => <p className="leading-7 mb-3">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-3">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-3">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-1">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt ?? ""}
              className="rounded-md my-4 max-w-full"
            />
          ),
          code: ({ children }) => {
            return (
              <code className="bg-muted p-3 rounded-md overflow-x-auto my-4">
                {children?.toString().trim()}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted pl-4 italic my-4">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border px-3 py-2 text-left bg-muted font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border px-3 py-2">{children}</td>
          ),
          input: ({ checked }) => {
            const lineIndex = taskLineIndices[taskPointer];
            taskPointer++;

            if (lineIndex === undefined) return null;

            return (
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleTask(lineIndex)}
              />
            );
          },
        }}
      >
        {content || " "}
      </ReactMarkdown>
    </div>
  );
};
