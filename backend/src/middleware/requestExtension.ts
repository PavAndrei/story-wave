import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
      sessionId?: Types.ObjectId;
    }
  }
}

export const setRequestExtensions = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};
