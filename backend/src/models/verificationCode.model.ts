import VerificationCodeType from '../constants/verificationCodeTypes.js';
import mongoose from 'mongoose';

export interface VerificationCodeDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: VerificationCodeType;
  createdAt: Date;
  expiresAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
  'VerificationCode',
  verificationCodeSchema,
  'verification_codes'
);

export default VerificationCodeModel;
