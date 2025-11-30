import catchErrors from '../utils/catchErrors';
import { createAccount, loginUser } from '../services/auth.service';
import { setAuthCookies, clearAuthCookies } from '../utils/cookies';
import { CREATED, OK } from '../constants/http';
import { loginSchema, registerSchema } from './auth.schemas';
import { verifyToken } from '../utils/jwt';
import SessionModel from '../models/session.model';

// register controller wrapped into catchError function

export const registerHandler = catchErrors(async (req, res) => {
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

export const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse(req.body);

  const { user, accessToken, refreshToken } = await loginUser(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ success: true, message: 'Logged in successfully', data: user });
});

export const logooutHandler = catchErrors(async (req, res) => {
  // logoout service logic to be implemented

  const accessToken = req.cookies.accessToken;
  const { payload, error } = verifyToken(accessToken);

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res)
    .status(OK)
    .json({ success: true, message: 'Logged out successfully' });
});
