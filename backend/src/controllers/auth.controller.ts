import z from 'zod';
import catchErrors from '../utils/catchErrors';
import { createAccount } from '../services/auth.service';
import { setAuthCookies } from '../utils/cookies';
import { CREATED } from '../constants/http';

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
  // validation
  console.log(req.body);
  const request = registerSchema.parse({
    ...req.body,
  });

  // service

  const { user, accessToken, refreshToken } = await createAccount(request);

  // response

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json({ success: true, message: 'The user was created', data: user });
});
