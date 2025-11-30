import jwt from 'jsonwebtoken';

import VerificationCodeModel from '../models/verificationCode.model';
import UserModel from '../models/user.model';
import VerificationCodeType from '../constants/verificationCodeTypes';
import { oneYearFromNow } from '../utils/date';
import SessionModel from '../models/session.model';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env';
import appAsert from '../utils/appAssert';
import { CONFLICT, UNAUTHORIZED } from '../constants/http';

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

  // verification code

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // send by email
  // session

  const session = await SessionModel.create({ userId: user._id });

  // refresh token

  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      expiresIn: '30d',
    }
  );

  // access token

  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    JWT_SECRET,
    {
      expiresIn: '15m',
    }
  );

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

  const refreshToken = jwt.sign(sessionInfo, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  // access token

  const accessToken = jwt.sign(
    { ...sessionInfo, userId: user._id },
    JWT_SECRET,
    {
      expiresIn: '15m',
    }
  );

  // return user and tokens

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};
