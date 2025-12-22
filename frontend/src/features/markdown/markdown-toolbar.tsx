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
      <button type="button" className={btn(state.bold)} onClick={actions.bold}>
        B
      </button>
      <button
        type="button"
        className={btn(state.italic)}
        onClick={actions.italic}
      >
        I
      </button>
      <button
        type="button"
        className={btn(state.strike)}
        onClick={actions.strike}
      >
        S
      </button>

      <span>|</span>

      <button type="button" className={btn(state.h1)} onClick={actions.h1}>
        H1
      </button>
      <button type="button" className={btn(state.h2)} onClick={actions.h2}>
        H2
      </button>
      <button type="button" className={btn(state.h3)} onClick={actions.h3}>
        H3
      </button>

      <span>|</span>

      <button type="button" className={btn(state.ul)} onClick={actions.ul}>
        •
      </button>
      <button type="button" className={btn(state.ol)} onClick={actions.ol}>
        1.
      </button>
    </div>
  );
};
