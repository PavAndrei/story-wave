import z from 'zod';

export const commentSchema = z.object({
  content: z.string().min(1).max(2000),
  blogId: z.string(),
  parentCommentId: z.string().optional(),
  replyToUserId: z.string().optional(),
});

export const editCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});
