import { z } from 'zod';

export const draftSchema = z.object({
  title: z.string().optional().default(''),
  content: z.string().optional().default(''),
  categories: z.array(z.string()).optional().default([]),
  coverImgUrl: z.string().optional().default(''),
  imagesUrls: z.array(z.string()).optional().default([]),
});

export const publishSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  categories: z.array(z.string()).optional().default([]),
  coverImgUrl: z.string().min(1, 'Cover image is required'),
  imagesUrls: z.array(z.string()).optional().default([]),
});

// export type CreatePostSchemaValues = z.infer<typeof createPostSchema>;

// export const editPostSchema = z.object({
//   title: z.string().min(1, { message: 'Title is required' }).optional(),
//   content: z.string().min(1, { message: 'Content is required' }).optional(),
//   categories: z.array(z.string()).optional(),
//   coverImgUrl: z.string().optional(),
//   imagesUrls: z.array(z.string()).optional(),
// });

// export type EditPostSchemaValues = z.infer<typeof editPostSchema>;

// export const postIdSchema = z.object({
//   id: z.string().min(1, 'Post id is required'),
// });

// export type PostIdSchemaValues = z.infer<typeof postIdSchema>;

// export const getMyDraftsSchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(50).default(10),
// });

// export type GetMyDraftsSchemaValues = z.infer<typeof getMyDraftsSchema>;

// export const getMyPublishedPostsSchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(50).default(10),
// });

// export type GetMyPublishedPostsSchemaValues = z.infer<
//   typeof getMyPublishedPostsSchema
// >;

// export const deletePostSchema = z.object({
//   id: z.string().min(1, 'Post id is required'),
// });

// export type DeletePostSchemaValues = z.infer<typeof deletePostSchema>;

// export const getAllPostsSchema = z.object({
//   page: z.coerce.number().int().min(1).default(1),
//   limit: z.coerce.number().int().min(1).max(50).default(10),
//   search: z.string().optional(),
//   category: z.string().optional(),
// });

// export type GetAllPostsSchemaValues = z.infer<typeof getAllPostsSchema>;
