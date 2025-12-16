import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z.string().min(1, { message: 'Content is required' }),
  categories: z.array(z.string()).optional().default([]),
  coverImgUrl: z.string().optional().default(''),
  imagesUrls: z.array(z.string()).optional().default([]),
});

export type CreatePostSchemaValues = z.infer<typeof createPostSchema>;

export const editPostSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  content: z.string().min(1, { message: 'Content is required' }).optional(),
  categories: z.array(z.string()).optional(),
  coverImgUrl: z.string().optional(),
  imagesUrls: z.array(z.string()).optional(),
});

export type EditPostSchemaValues = z.infer<typeof editPostSchema>;

export const postIdSchema = z.object({
  id: z.string().min(1, 'Post id is required'),
});

export type PostIdSchemaValues = z.infer<typeof postIdSchema>;

export const getMyDraftsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type GetMyDraftsSchemaValues = z.infer<typeof getMyDraftsSchema>;
