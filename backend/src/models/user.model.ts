import mongoose from 'mongoose';
import { compareValue, hashValue } from '../utils/bcrypt.js';

export interface UserDocument extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  verified: boolean;
  avatarUrl: string | undefined | null;
  avatarPublicId: string | undefined | null;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, 'password'>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    avatarUrl: {
      type: String,
      required: false,
      default: '',
    },
    avatarPublicId: {
      type: String,
      required: false,
      default: '',
    },
    bio: {
      type: String,
      required: false,
      default: '',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await hashValue(this.password);
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.methods.omitPassword = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
