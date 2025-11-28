import z from 'zod';
import catchErrors from '../utils/catchErrors';

// validation schema

const registerSchema = z
  .object({
    username: z.string().min(1).max(255),
    email: z.email().min(1).max(255),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    avatarUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// register controller wrapped into catchError function

export const registerHandler = catchErrors(async (req, res, next) => {
  const request = registerSchema.parse({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
});
