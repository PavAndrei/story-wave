import mongoose from 'mongoose';
import { NOT_FOUND } from '../constants/http.js';
import UserModel from '../models/user.model.js';
import appAssert from '../utils/appAssert.js';
import { cloudinary, deleteFromCloudinaryByUrl } from '../utils/cloudinary.js';
import SessionModel from '../models/session.model.js';
import VerificationCodeModel from '../models/verificationCode.model.js';

interface ChangeUserDataParams {
  request: {
    username?: string;
    bio?: string;
    removeAvatar?: string;
  };
  avatarPath?: string;
  userId?: mongoose.Types.ObjectId;
}

export const changeUserData = async ({
  request,
  avatarPath,
  avatarPublicId,
  userId,
}: ChangeUserDataParams & { avatarPublicId?: string }) => {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, 'User not found');

  if (request.removeAvatar && user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId);

    user.avatarUrl = undefined;
    user.avatarPublicId = undefined;
  }

  if (avatarPath && avatarPublicId) {
    if (user.avatarPublicId) {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    }

    user.avatarUrl = avatarPath;
    user.avatarPublicId = avatarPublicId;
  }

  if (request.username) user.username = request.username;

  if (!request.bio) {
    user.bio = '';
  } else {
    user.bio = request.bio;
  }

  await user.save();
  return user;
};

export const deleteUserById = async (userId?: mongoose.Types.ObjectId) => {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, 'User not found');

  if (user.avatarUrl) {
    await deleteFromCloudinaryByUrl(user.avatarUrl);
  }

  await SessionModel.deleteMany({ userId });

  await VerificationCodeModel.deleteMany({ userId });

  await UserModel.findByIdAndDelete(userId);

  return {
    deletedUserId: userId,
  };
};
