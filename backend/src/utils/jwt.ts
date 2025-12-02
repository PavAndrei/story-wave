import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';

import { UserDocument } from '../models/user.model.js';
import { SessionDocument } from '../models/session.model.js';
import { JWT_REFRESH_SECRET, JWT_SECRET } from '../constants/env.js';

export type RefreshTokenPayload = {
  sessionId: SessionDocument['_id'];
};

export type AccessTokenPayload = {
  userId: UserDocument['_id'];
  sessionId: SessionDocument['_id'];
};

type SignOptionsAndSecret = SignOptions & { secret: string };

// const defaults: SignOptions = {};

export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '15m',
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: '30d',
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: RefreshTokenPayload | AccessTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secret, ...otherSignOptions } = options || accessTokenSignOptions;

  return jwt.sign(payload, secret, otherSignOptions);
};

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = JWT_SECRET, ...otherVerifyOptions } = options || {};

  try {
    const payload = jwt.verify(token, secret, otherVerifyOptions) as TPayload;

    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};
