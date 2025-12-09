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
    html: `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f1f5f9;
    padding: 24px;
    color: #334155;
  ">
    <div style="
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    ">
      <h1 style="
        font-size: 22px;
        margin-bottom: 12px;
        color: #0e7490;
        text-align: center;
      ">
        Verify Your Email Address
      </h1>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
        Thank you for signing up to <strong>StoryWave</strong>!  
        Before we give you full access to your account, we need to confirm that this email address belongs to you.
      </p>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        Please click the button below to verify your email.  
        This helps us keep your account secure and ensures you receive important notifications.
      </p>

      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${APP_ORIGIN}/verify-email/${verificationCode._id}" 
          style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #06b6d4;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
          "
        >
          Verify Email
        </a>
      </div>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="font-size: 14px; word-break: break-all; color: #0e7490; margin-bottom: 24px;">
        ${APP_ORIGIN}/verify-email/${verificationCode._id}
      </p>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
        If you did not create an account on StoryWave, you can safely ignore this email.
      </p>

      <p style="margin-top: 32px; font-size: 14px; color: #94a3b8; text-align: right;">
        — The StoryWave Team
      </p>
    </div>
  </div>
`,
  });

  return { user: user.omitPassword() };
};

export type LoginParams = {
  email: string;
  password: string;
};

export const loginUser = async ({ email, password }: LoginParams) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, 'Invalid email or password');

  // 1. Проверка verified
  appAssert(
    user.verified,
    UNAUTHORIZED,
    'Email is not verified. Please verify your email before logging in.'
  );

  // 2. Проверка пароля
  const isValidPassword = await user.comparePassword(password);
  appAssert(isValidPassword, UNAUTHORIZED, 'Invalid email or password');

  // 3. Создаём сессию
  const session = await SessionModel.create({ userId: user._id });

  const sessionInfo = { sessionId: session._id };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({
    ...sessionInfo,
    userId: user._id,
  });

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
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });

  appAssert(validCode, NOT_FOUND, 'Invalid or expired verification code');

  // 1. Обновляем verified
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { verified: true },
    { new: true }
  );

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to verify user');

  // 2. Удаляем verification code
  await validCode.deleteOne();

  // 3. Создаём session
  const session = await SessionModel.create({ userId: updatedUser._id });

  // 4. Создаём токены
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    userId: updatedUser._id,
    sessionId: session._id,
  });

  // 5. Возвращаем токены и user
  return {
    user: updatedUser.omitPassword(),
    accessToken,
    refreshToken,
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
    html: `
  <div style="
    font-family: Arial, sans-serif;
    background-color: #f1f5f9;
    padding: 24px;
    color: #334155;
  ">
    <div style="
      max-width: 520px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    ">
      <h1 style="
        font-size: 22px;
        margin-bottom: 12px;
        color: #0e7490;
        text-align: center;
      ">
        Reset Your Password
      </h1>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
        We received a request to reset the password for your <strong>StoryWave</strong> account.
        If you made this request, you can set a new password by clicking the button below.
      </p>

      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        For your security, this link will only be valid for <strong>one hour</strong>.
        If it expires, you can always request a new one.
      </p>

      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${url}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background-color: #06b6d4;
            color: #ffffff;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
          "
        >
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
        If the button above doesn’t work, copy and paste this link into your browser:
      </p>

      <p style="font-size: 14px; word-break: break-all; color: #0e7490; margin-bottom: 24px;">
        ${url}
      </p>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6;">
        If you didn’t request a password reset, you can safely ignore this email.
        Your password will remain unchanged.
      </p>

      <p style="margin-top: 32px; font-size: 14px; color: #94a3b8; text-align: right;">
        — The StoryWave Team
      </p>
    </div>
  </div>
`,
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
  appAssert(
    validCode,
    NOT_FOUND,
    'Invalid or expired verification code. Try again.'
  );

  // update user password
  const updatedUser = await UserModel.findByIdAndUpdate(validCode!.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, 'Failed to reset password');

  // delete verification codes
  await VerificationCodeModel.deleteMany({
    userId: validCode.userId,
    type: VerificationCodeType.PasswordReset,
  });

  // delete all the sessions for that user
  await SessionModel.deleteMany({ userId: updatedUser._id });

  return {
    user: updatedUser.omitPassword(),
  };
};
