import type { CommentDTO } from "@/shared/api/api-types";
import { useCommentActions } from "../model/use-comment-actions";
import { useCommentDelete } from "../model/use-comment-delete";
import { useEditComment } from "../model/use-edit-comment";
import { CommentItem } from "./comment-item";
import { Skeleton } from "@/shared/ui/kit/skeleton";
import { useToggleLike } from "../model/use-toggle-like";

const SkeletonCommentsList = ({ count = 12 }: { count: number }) => {
  return (
    <ul className="flex flex-col gap-4 items-center">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="rounded-lg bg-slate-200 p-4 w-full">
          <div className="flex items-start gap-3">
            <Skeleton className="size-8 rounded-full bg-slate-50" />

            <div className="flex flex-1 gap-4 flex-col justify-center">
              <div className="flex items-center gap-2">
                <Skeleton className="bg-slate-50 rounded px-2 py-1 w-1/10 h-3" />
                <Skeleton className="bg-slate-50 rounded px-2 py-1 w-1/10 h-3" />
              </div>

              <Skeleton className="h-15 bg-slate-50 rounded" />
              <Skeleton className="w-16 h-6 bg-slate-50 rounded" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

type CommentsListProps = {
  comments: CommentDTO[];
  isLoading?: boolean;
  cursorRef?: React.Ref<HTMLDivElement>;
  isFetchingNextPage?: boolean;
};

export const CommentsList = ({
  comments,
  cursorRef,
  isFetchingNextPage,
  isLoading,
}: CommentsListProps) => {
  const actions = useCommentActions();
  const deleteMutation = useCommentDelete();
  const editMutation = useEditComment();
  const toggleLike = useToggleLike();

  if (isLoading) return <SkeletonCommentsList count={10} />;

  if (!comments.length) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-200 p-4 text-sm text-slate-600">
        No comments yet. Be the first to start the discussion.
      </div>
    );
  }

  return (
    <>
      <ul className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            actions={actions}
            deleteMutation={deleteMutation}
            editMutation={editMutation}
            toggleLike={toggleLike}
          />
        ))}
      </ul>
      {isFetchingNextPage && <SkeletonCommentsList count={12} />}
      <div ref={cursorRef} className="h-10" />
    </>
  );
};
