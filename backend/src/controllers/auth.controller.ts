import catchErrors from '../utils/catchErrors';
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from '../services/auth.service';
import {
  setAuthCookies,
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
} from '../utils/cookies';
import { CREATED, OK, UNAUTHORIZED } from '../constants/http';
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from './auth.schemas';
import { verifyToken } from '../utils/jwt';
import SessionModel from '../models/session.model';
import appAssert from '../utils/appAssert';

// register controller wrapped into catchError function
export const registerHandler = catchErrors(async (req, res) => {
  // validation
  console.log(req.body);
  const request = registerSchema.parse({
    ...req.body,
  });

  // service
  const { user, accessToken, refreshToken } = await createAccount(request);

  // return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json({ success: true, message: 'The user was created', data: user });
});

// login controller wrapped into catchError function
export const loginHandler = catchErrors(async (req, res) => {
  // validation
  const request = loginSchema.parse(req.body);

  // service
  const { user, accessToken, refreshToken } = await loginUser(request);

  // return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ success: true, message: 'Logged in successfully', data: user });
});

// logout controller wrapped into catchError function
export const logooutHandler = catchErrors(async (req, res) => {
  // get access token from cookies
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || '');

  // delete session from db
  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  // clear cookies and return response
  return clearAuthCookies(res)
    .status(OK)
    .json({ success: true, message: 'Logged out successfully' });
});

// refresh controller wrapped into catchError function
export const refreshHandler = catchErrors(async (req, res) => {
  // get refresh token from cookies
  const refreshToken = req.cookies.refreshToken as string | undefined;

  // assert that refresh token exists
  appAssert(refreshToken, UNAUTHORIZED, 'Refresh token not found');

  // refresh user access token
  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    return res.cookie(
      'refreshToken',
      newRefreshToken,
      getRefreshTokenCookieOptions()
    );
  }

  // set new cookies and return response
  return res
    .status(OK)
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .json({
      success: true,
      message: 'Access token refreshed successfully',
    });
});

// verify email controller wrapped into catchError function
export const verifyEmailHandler = catchErrors(async (req, res) => {
  // validation
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res
    .status(OK)
    .json({ success: true, message: 'Email verified successfully' });
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
  // validation
  const email = emailSchema.parse(req.body.email);

  // service
  await sendPasswordResetEmail(email);

  // return response
  return res
    .status(OK)
    .json({ success: true, message: 'Password reset email sent' });
});

export const resetPasswordHandler = catchErrors(async (req, res) => {
  // validation
  const request = resetPasswordSchema.parse(req.body);

  // service
  await resetPassword(request);

  // return response
  return clearAuthCookies(res).status(OK).json({
    success: true,
    message: 'Password has been reset successfully',
  });
});
