import z from 'zod';

export const commentSchema = z.object({
  content: z.string(),
  blogId: z.string(),
  parentCommentId: z.string().optional(),
  replyToUserId: z.string().optional(),
});

export const deleteCommentSchema = z.object({
  commentId: z.string(),
});
