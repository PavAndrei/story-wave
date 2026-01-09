import type { CommentDTO } from "@/shared/api/api-types";

export const CommentsList = ({ comments }: { comments: CommentDTO[] }) => {
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
              {/* {comment.authorId.username[0].toUpperCase()} */}
              author username
            </div>

            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-800">
                  {/* {comment.authorId.username} */}
                  author username
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-sm text-slate-700">{comment.content}</p>
            </div>
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <ul className="mt-4 flex flex-col gap-3 border-l border-slate-600 pl-6">
              {comment.replies.map((reply) => (
                <li key={reply._id} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-300 text-xs font-medium text-slate-700">
                    {/* {reply.authorId.username[0].toUpperCase()} */}
                    author username
                  </div>

                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2 text-sm">
                      <span className="font-medium text-slate-800">
                        {/* {reply.authorId.username} */}
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
