import type { useMarkdownToolbar } from "./use-markdown-toolbar";

type Props = {
  toolbar: ReturnType<typeof useMarkdownToolbar>;
};

export const MarkdownToolbar = ({ toolbar }: Props) => {
  if (!toolbar) return;

  const { actions, state } = toolbar;

  const btn = (active?: boolean) =>
    `px-2 py-1 rounded ${active ? "bg-primary text-white" : "bg-muted"}`;

  return (
    <div className="flex gap-1 p-2 border rounded">
      <button
        type="button"
        className={btn(state.bold)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.bold();
        }}
      >
        B
      </button>

      <button
        type="button"
        className={btn(state.italic)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.italic();
        }}
      >
        I
      </button>
      <button
        type="button"
        className={btn(state.strike)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.strike();
        }}
      >
        S
      </button>

      <span>|</span>

      <button
        type="button"
        className={btn(state.h1)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.h1();
        }}
      >
        H1
      </button>
      <button
        type="button"
        className={btn(state.h2)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.h2();
        }}
      >
        H2
      </button>
      <button
        type="button"
        className={btn(state.h3)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.h3();
        }}
      >
        H3
      </button>

      <span>|</span>

      <button
        type="button"
        className={btn(state.ul)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.ul();
        }}
      >
        •
      </button>
      <button
        type="button"
        className={btn(state.ol)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.ol();
        }}
      >
        1.
      </button>

      <button
        type="button"
        className={btn(state.task)}
        onMouseDown={(e) => {
          e.preventDefault();
          actions.task();
        }}
      >
        ☑
      </button>
    </div>
  );
};
