import { NOT_FOUND, OK } from '../constants/http.js';
import SessionModel from '../models/session.model.js';
import appAssert from '../utils/appAssert.js';
import catchErrors from '../utils/catchErrors.js';
import z from 'zod';

export const getSessionHandler = catchErrors(async (req, res) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: new Date() },
    },
    {
      _id: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  return res.status(OK).json(
    {
      success: true,
      message: 'Sessions found',
      sessions: sessions.map((session) => ({
        ...session.toObject(),
        ...(session._id === req.sessionId && {
          isCurrent: true,
        }),
      })),
    }
    // mark the current session
  );
});

export const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, 'Session not found');
  return res.status(OK).json({ message: 'Session removed' });
});
