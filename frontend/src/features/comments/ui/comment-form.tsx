import { useState } from "react";
import { Send } from "lucide-react";
import { useCreateComment } from "../model/use-create-comment";
import { MAX_COMMENT_LENGTH } from "../constants";

type CommentFormMode = "comment" | "reply";

type CommentFormProps = {
  blogId: string;
  mode?: CommentFormMode;

  parentCommentId?: string;
  replyToUsername?: string;
  replyToUserId?: string;

  onSuccess?: () => void;
};

export const CommentForm = ({
  blogId,
  mode = "comment",

  parentCommentId,
  replyToUserId,
  replyToUsername,

  onSuccess,
}: CommentFormProps) => {
  const [content, setContent] = useState("");
  const { createComment, isLoading } = useCreateComment();

  const length = content.length;
  const isTooLong = length > MAX_COMMENT_LENGTH;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Esc → cancel (только для reply)
    if (e.key === "Escape" && mode === "reply") {
      e.preventDefault();
      onSuccess?.();
      return;
    }

    // Ctrl / Cmd + Enter → submit
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const form = e.currentTarget.form;
      form?.requestSubmit();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isTooLong) return;

    createComment(
      {
        blogId,
        content,
        parentCommentId,
        replyToUserId,
      },
      {
        onSuccess: () => {
          setContent("");

          if (mode === "reply") {
            onSuccess?.();
          }
        },
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-700 bg-slate-200 p-4"
    >
      {/* Title */}
      <div className="mb-2 text-sm text-slate-600">
        {mode === "reply" && replyToUsername ? (
          <>
            Replying to{" "}
            <span className="font-medium text-cyan-600">
              @{replyToUsername}
            </span>
          </>
        ) : (
          "Add a comment"
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          mode === "reply" && replyToUsername
            ? `Reply to @${replyToUsername}...`
            : "Write your comment..."
        }
        rows={3}
        maxLength={MAX_COMMENT_LENGTH + 50}
        className="w-full resize-none rounded-md border border-slate-700 bg-slate-100 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      />

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        {/* Counter */}
        <span
          className={[
            "text-xs",
            isTooLong
              ? "text-red-600"
              : length > MAX_COMMENT_LENGTH * 0.8
                ? "text-cyan-600"
                : "text-slate-500",
          ].join(" ")}
        >
          {length} / {MAX_COMMENT_LENGTH}
        </span>

        {/* Submit */}
        <button
          type="submit"
          disabled={!content.trim() || isLoading || isTooLong}
          className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Send className="h-4 w-4" />
          {isLoading ? "Posting..." : "Post"}
        </button>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Ctrl / Cmd + Enter to send</span>
          {mode === "reply" && <span>Esc to cancel</span>}
        </div>
      </div>
    </form>
  );
};
