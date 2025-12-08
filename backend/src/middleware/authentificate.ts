import { RequestHandler } from 'express';
import appAssert from '../utils/appAssert.js';
import { UNAUTHORIZED } from '../constants/http.js';
import { verifyToken } from '../utils/jwt.js';
import mongoose from 'mongoose';
import AppErrorCode from 'constants/appErrorCode.js';

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  appAssert(
    refreshToken,
    UNAUTHORIZED,
    'No refresh token',
    AppErrorCode.NoRefreshToken
  );

  // 2️⃣ Проверяем access token
  //    Если его нет или истёк → фронт попробует сделать refresh
  appAssert(
    accessToken,
    UNAUTHORIZED,
    'Invalid access token',
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken || '');

  appAssert(
    payload,
    UNAUTHORIZED,
    error === 'jwt expired' ? 'Token expired' : 'Invalid token',
    AppErrorCode.InvalidAccessToken
  );

  // 3️⃣ Если всё ок → прокидываем userId и sessionId
  req.userId = new mongoose.Types.ObjectId(payload.userId);
  req.sessionId = new mongoose.Types.ObjectId(payload.sessionId);

  next();
};

export default authenticate;
