import z from 'zod';

export const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is too short')
      .max(255, 'Username is too long')
      .optional(),

    bio: z.string().max(255, 'Bio is too long').optional(),

    removeAvatar: z.string().optional(),
  })
  .strict();
