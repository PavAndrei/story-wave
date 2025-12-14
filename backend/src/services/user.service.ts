import mongoose from 'mongoose';
import { NOT_FOUND } from '../constants/http.js';
import UserModel from '../models/user.model.js';
import appAssert from '../utils/appAssert.js';

interface ChangeUserDataParams {
  request: {
    username?: string;
    bio?: string;
  };
  avatarPath?: string;
  userId?: mongoose.Types.ObjectId;
}

export const changeUserData = async ({
  request,
  avatarPath,
  userId,
}: ChangeUserDataParams) => {
  // Find the user
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, 'User not found');

  // const removeAvatar = req.body.removeAvatar === 'true';

  // if (removeAvatar) {
  //   user.avatarUrl = null;
  //   // + удалить из Cloudinary (позже)
  // }

  // Update the user
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      username: request.username ? request.username : user.username,
      bio: request.bio ? request.bio : user.bio,
      avatarUrl: avatarPath ? avatarPath : user.avatarUrl,
    },
    { new: true }
  );
  appAssert(updatedUser, NOT_FOUND, 'Update failed');
  return updatedUser;
};
