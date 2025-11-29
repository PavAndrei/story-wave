import mongoose from 'mongoose';
import { compareValue, hashValue } from '../utils/bcrypt';

export interface UserDocument extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  verified: boolean;
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
  },
  { timestamps: true }
);

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next();
//   }
//   this.password = await hashValue(this.password);
//   next();
// });

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
