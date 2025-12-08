import { Request, RequestHandler } from 'express';
import appAssert from '../utils/appAssert.js';
import { UNAUTHORIZED } from '../constants/http.js';
import { verifyToken } from '../utils/jwt.js';
import mongoose from 'mongoose';
import AppErrorCode from 'constants/appErrorCode.js';

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    'Not authorized',
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken || '');

  appAssert(
    payload,
    UNAUTHORIZED,
    error === 'jwt expired' ? 'Token expired' : 'Invalid token',
    AppErrorCode.InvalidAccessToken
  );

  req.userId = new mongoose.Types.ObjectId(payload.userId);
  req.sessionId = new mongoose.Types.ObjectId(payload.sessionId);

  next();
};

export default authenticate;
