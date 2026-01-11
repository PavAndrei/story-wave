import { useState } from "react";
import type { CommentDTO } from "@/shared/api/api-types";

export const useCommentActions = () => {
  const [replyTo, setReplyTo] = useState<{
    commentId: string;
    username?: string;
    userId?: string;
  } | null>(null);

  const [editing, setEditing] = useState<{
    commentId: string;
    content: string;
  } | null>(null);

  const startReply = (comment: CommentDTO) => {
    setEditing(null);
    setReplyTo({
      commentId: comment._id,
      username: comment.author.username,
      userId: comment.author._id,
    });
  };

  const cancelReply = () => setReplyTo(null);

  const startEdit = (comment: CommentDTO) => {
    setReplyTo(null);
    setEditing({
      commentId: comment._id,
      content: comment.content,
    });
  };

  const cancelEdit = () => setEditing(null);

  return {
    replyTo,
    editing,

    startReply,
    cancelReply,

    startEdit,
    cancelEdit,
    setEditing,
  };
};
