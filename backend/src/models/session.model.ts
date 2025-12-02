import mongoose from 'mongoose';
import { thirtyDaysFromNow } from '../utils/date.js';

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
  userId: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  createdAt: { type: Date, required: true, default: Date.now() },
  expiresAt: { type: Date, default: thirtyDaysFromNow },
});

const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);

export default SessionModel;
