import type { CommentDTO } from "@/shared/api/api-types";
import type { useCommentActions } from "../model/use-comment-actions";
import type { useCommentDelete } from "../model/use-comment-delete";
import type { useEditComment } from "../model/use-edit-comment";
import { CommentForm } from "./comment-form";
import { MAX_COMMENT_LENGTH } from "../constants";
import { useToggleLike } from "../model/use-toggle-like";
import { Heart } from "lucide-react";

const clampContent = (value: string) => value.slice(0, MAX_COMMENT_LENGTH);

type Props = {
  comment: CommentDTO;
  actions: ReturnType<typeof useCommentActions>;
  deleteMutation: ReturnType<typeof useCommentDelete>;
  editMutation: ReturnType<typeof useEditComment>;
  toggleLike: ReturnType<typeof useToggleLike>;
};

export const CommentItem = ({
  comment,
  actions,
  deleteMutation,
  editMutation,
  toggleLike,
}: Props) => {
  const isEditing = actions.editing?.commentId === comment._id;
  const isReplying = actions.replyTo?.commentId === comment._id;

  const submitEdit = () => {
    if (!actions.editing) return;

    editMutation.editComment(
      {
        commentId: actions.editing.commentId,
        content: actions.editing.content,
      },
      {
        onSuccess: actions.cancelEdit,
      },
    );
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      actions.cancelEdit();
    }

    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submitEdit();
    }
  };

  console.log(comment.likesCount);

  const { toggle, getLikeState } = toggleLike;
  const { isLiked, likesCount } = getLikeState(comment);

  return (
    <li className="rounded-lg border border-slate-700 bg-slate-200 p-4">
      {/* Root / Reply content */}
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-xs font-medium text-slate-700">
          author
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-800">
              {comment.author.username}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Content / Edit */}
          {isEditing ? (
            <>
              <textarea
                value={actions.editing!.content}
                onChange={(e) =>
                  actions.setEditing((prev) =>
                    prev
                      ? {
                          ...prev,
                          content: clampContent(e.target.value),
                        }
                      : prev,
                  )
                }
                rows={comment.level === 0 ? 3 : 2}
                maxLength={MAX_COMMENT_LENGTH}
                onKeyDown={handleEditKeyDown}
                className="w-full resize-none rounded-md border border-slate-700 bg-slate-100 px-3 py-2 text-sm"
              />

              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>Ctrl / Cmd + Enter to save</span>
                <span>
                  {actions.editing!.content.length} / {MAX_COMMENT_LENGTH}
                </span>
              </div>

              <div className="mt-2 flex gap-2">
                <button
                  onClick={submitEdit}
                  disabled={
                    editMutation.isPending || !actions.editing!.content.trim()
                  }
                  className="rounded-md bg-cyan-600 px-3 py-1 text-xs font-medium text-white"
                >
                  {editMutation.isPending ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={actions.cancelEdit}
                  disabled={editMutation.isPending}
                  className="rounded-md bg-slate-400 px-3 py-1 text-xs font-medium text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-700">{comment.content}</p>
          )}

          {/* Actions */}
          <div className="mt-2 flex items-center gap-2">
            {comment.level === 0 && (
              <button
                onClick={() => actions.startReply(comment)}
                className="text-xs font-medium text-cyan-600 hover:underline"
              >
                Reply
              </button>
            )}

            <button
              onClick={() => deleteMutation.deleteComment(comment._id)}
              disabled={deleteMutation.isPending}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Delete
            </button>

            <button
              onClick={() => actions.startEdit(comment)}
              className="text-xs font-medium text-cyan-600 hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              className="flex items-center gap-2"
              onClick={() => toggle(comment)}
            >
              <Heart
                className={
                  isLiked ? "fill-red-500 text-red-500" : "text-slate-500"
                }
              />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reply form (ONLY for root comments) */}
      {isReplying && comment.level === 0 && (
        <div className="mt-3 pl-11">
          <CommentForm
            blogId={comment.blog._id}
            mode="reply"
            parentCommentId={comment._id}
            replyToUserId={comment.author._id}
            replyToUsername={comment.author.username}
            onSuccess={actions.cancelReply}
          />

          <button
            onClick={actions.cancelReply}
            className="mt-2 text-xs text-slate-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Replies (NO recursion) */}
      {comment.replies?.length ? (
        <ul className="mt-4 flex flex-col gap-3 border-l border-slate-600 pl-6">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              actions={actions}
              deleteMutation={deleteMutation}
              editMutation={editMutation}
              toggleLike={toggleLike}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};
