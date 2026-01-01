import type { EditorStatus } from "../model/use-blog-editor";

type Props = {
  status: EditorStatus;
};

export const EditorStatusBar = ({ status }: Props) => {
  switch (status) {
    case "idle":
      return <span className="text-muted text-xs">Start writing…</span>;

    case "editing":
      return <span className="text-muted text-xs">Unsaved changes</span>;

    case "saving":
      return <span className="text-muted text-xs">Saving…</span>;

    case "saved":
      return <span className="text-muted text-xs">All changes saved</span>;

    case "publishing":
      return <span className="text-muted text-xs">Publishing…</span>;

    case "published":
      return <span className="text-muted text-xs">Published</span>;

    case "error":
      return <span className="text-red-600 text-xs">Error while saving</span>;
  }
};
