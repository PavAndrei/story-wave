import { useState } from "react";
import type { CommentDTO } from "@/shared/api/api-types";
import { CommentForm } from "./comment-form";

export const CommentsList = ({ comments }: { comments: CommentDTO[] }) => {
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    username?: string;
    userId?: string;
  } | null>(null);

  if (!comments.length) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-200 p-4 text-sm text-slate-600">
        No comments yet. Be the first to start the discussion.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment) => (
        <li
          key={comment._id}
          className="rounded-lg border border-slate-700 bg-slate-200 p-4"
        >
          {/* Root comment */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-xs font-medium text-slate-700">
              author
            </div>

            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-800">
                  author username
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-slate-700">{comment.content}</p>

              {/* Reply button */}
              <button
                onClick={() =>
                  setReplyTo({
                    commentId: comment._id,
                    username: "author username",
                    userId: comment.author._id,
                  })
                }
                className="mt-2 text-xs font-medium text-cyan-600 hover:underline"
              >
                Reply
              </button>
            </div>
          </div>

          {/* Inline reply form */}
          {replyTo?.commentId === comment._id && (
            <div className="mt-3 pl-11">
              <CommentForm
                blogId={comment.blog._id}
                mode="reply"
                parentCommentId={comment._id}
                replyToUserId={comment.author._id}
                replyToUsername={comment.author.username}
                onSuccess={() => setReplyTo(null)}
              />

              <button
                onClick={() => setReplyTo(null)}
                className="mt-2 text-xs text-slate-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <ul className="mt-4 flex flex-col gap-3 border-l border-slate-600 pl-6">
              {comment.replies.map((reply) => (
                <li key={reply._id} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-xs font-medium text-slate-700">
                    author
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2 text-sm">
                      <span className="font-medium text-slate-800">
                        author username
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700">{reply.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
