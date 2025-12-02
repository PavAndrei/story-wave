import VerificationCodeModel from '../models/verificationCode.model.js';
import UserModel from '../models/user.model.js';
import VerificationCodeType from '../constants/verificationCodeTypes.js';
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from '../utils/date.js';
import SessionModel from '../models/session.model.js';
import appAssert from '../utils/appAssert.js';
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUEST,
  UNAUTHORIZED,
} from '../constants/http.js';
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from '../utils/jwt.js';
import { APP_ORIGIN, SMTP_USER } from '../constants/env.js';
import { sendEmail } from '../utils/emails.js';
import { hashValue } from '../utils/bcrypt.js';

// define params for a new user

export type createAccountParams = {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
};

// creating a new user account service

export const createAccount = async (data: createAccountParams) => {
  // check if that user hasn't been created before

  const existingUser = await UserModel.exists({ email: data.email });

  // if (existingUser) {
  //   throw new Error('User already exists in data base');
  // }

  appAssert(!existingUser, CONFLICT, 'User already exists in data base');

  // create a new user

  const user = await UserModel.create({
    username: data.username,
    email: data.email,
    password: data.password,
  });

  const userId = user._id;

  // verification code

  const verificationCode = await VerificationCodeModel.create({
    userId: userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // send by email

  await sendEmail({
    from: `"StoryWave" <${SMTP_USER}>`,
    to: user.email,
    subject: 'Verify your email address',
    html: `<p>Please verify your email by clicking <a href="https://yourapp.com/verify-email?code=${verificationCode._id}">here</a>.</p>`,
  });

  // session

  const session = await SessionModel.create({ userId });

  // refresh token

  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  // access token

  const accessToken = signToken({
    userId: userId,
    sessionId: session._id,
  });

  // return user and tokens

  return { user: user.omitPassword(), accessToken, refreshToken };
};

export type LoginParams = {
  email: string;
  password: string;
};

export const loginUser = async ({ email, password }: LoginParams) => {
  // get user by email

  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, 'Invalid email or password');

  // validate password

  const isValidPassword = await user.comparePassword(password);
  appAssert(isValidPassword, UNAUTHORIZED, 'Invalid email or password');

  const userId = user._id;

  // create session

  const session = await SessionModel.create({ userId });

  const sessionInfo = { sessionId: session._id };

  // refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  // access token
  const accessToken = signToken({ ...sessionInfo, userId: user._id });

  // return user and tokens
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });

  appAssert(payload, UNAUTHORIZED, 'Invalid refresh token');

  const session = await SessionModel.findById(payload.sessionId);

  const now = Date.now();

  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    'Session expired'
  );

  // refresh the session if it expires in 24 hours

  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;

  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return { accessToken, newRefreshToken };
};

export const verifyEmail = async (code: string) => {
  // get the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });

  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

  // update user verified status to true
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode!.userId,
    { verified: true },
    { new: true }
  );

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to verify user');

  // delete verification code

  await validCode.deleteOne();
  // return user
  return {
    user: updatedUser.omitPassword(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  // get user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, NOT_FOUND, 'User with this email does not exist');

  // check email rate limit
  const rateLimit = fiveMinutesAgo();
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    createdAt: { $gt: rateLimit },
  });
  appAssert(
    count <= 1,
    TOO_MANY_REQUEST,
    'Password reset email already sent recently, try later'
  );

  // One hour from now
  const expiresAt = oneHourFromNow();

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt,
  });

  // send email
  const url = `${APP_ORIGIN}/password/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  await sendEmail({
    from: `"StoryWave" <${SMTP_USER}>`,
    to: user.email,
    subject: 'Password Reset Request',
    html: `<p>You can reset your password by clicking <a href="${url}">here</a>. This link will expire in one hour.</p>`,
  });

  return {
    success: true,
    message: 'Password reset email sent successfully',
    emailId: user.email,
  };
};

export const resetPassword = async ({
  password,
  verificationCode,
}: {
  password: string;
  verificationCode: string;
}) => {
  // get the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

  // update user password
  const updatedUser = await UserModel.findByIdAndUpdate(validCode!.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to reset password');

  // delete verification code
  await validCode.deleteOne();

  // delete all the sessions for that user
  await SessionModel.deleteMany({ userId: updatedUser._id });

  return {
    user: updatedUser.omitPassword(),
  };
};
