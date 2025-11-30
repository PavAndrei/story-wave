import jwt from 'jsonwebtoken';

import VerificationCodeModel from '../models/verificationCode.model';
import UserModel from '../models/user.model';
import VerificationCodeType from '../constants/verificationCodeTypes';
import { oneYearFromNow } from '../utils/date';
import SessionModel from '../models/session.model';
import { JWT_REFRESH_SECRET } from '../constants/env';
import appAsert from '../utils/appAssert';
import { CONFLICT, UNAUTHORIZED } from '../constants/http';
import { refreshTokenSignOptions, signToken } from '../utils/jwt';

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

  appAsert(!existingUser, CONFLICT, 'User already exists in data base');

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
  appAsert(user, UNAUTHORIZED, 'Invalid email or password');

  // validate password

  const isValidPassword = await user.comparePassword(password);
  appAsert(isValidPassword, UNAUTHORIZED, 'Invalid email or password');

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
