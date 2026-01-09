import { useState } from "react";
import { Send } from "lucide-react";

type CommentFormProps = {
  blogId: string;
  parentCommentId?: string;
  replyToUsername?: string;
};

export const CommentForm = ({
  blogId,
  parentCommentId,
  replyToUsername,
}: CommentFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      blogId,
      content,
      parentCommentId,
    };

    console.log("Create comment payload:", payload);

    setContent("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-700 bg-slate-200 p-4"
    >
      <div className="mb-2 text-sm text-slate-600">
        {replyToUsername ? (
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

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          replyToUsername
            ? `Reply to @${replyToUsername}...`
            : "Write your comment..."
        }
        rows={3}
        className="w-full resize-none rounded-md border border-slate-700 bg-slate-100 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={!content.trim()}
          className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Send className="h-4 w-4" />
          Post
        </button>
      </div>
    </form>
  );
};
