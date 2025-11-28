import jwt from 'jsonwebtoken';

import VerificationCodeModel from '../models/verificationCode.model';
import UserModel from '../models/user.model';
import VerificationCodeType from '../constants/verificationCodeTypes';
import { oneYearFromNow } from '../utils/date';
import SessionModel from '../models/session.model';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env';

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

  if (existingUser) {
    throw new Error('User already exists in data base');
  }

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

  return { user, accessToken, refreshToken };
};
