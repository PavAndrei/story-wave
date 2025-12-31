import { z } from 'zod';

export const draftSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  categories: z.array(z.string()).optional(),
  coverImgUrl: z.string().optional(),
  imagesUrls: z.array(z.string()).optional(),
});

export const publishSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  categories: z.array(z.string()).optional(),
  coverImgUrl: z.string().min(1, 'Cover image is required'),
  imagesUrls: z.array(z.string()).optional(),
});

export const EditBlogSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  categories: z.array(z.string()).optional(),
  coverImgUrl: z.string().nullable().optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export type EditBlogSchemaValues = z.infer<typeof EditBlogSchema>;
