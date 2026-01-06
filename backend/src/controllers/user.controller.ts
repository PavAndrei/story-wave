import {
  changeUserData,
  deleteUserById,
  getTopUsers,
} from '../services/user.service.js';
import { NOT_FOUND, OK } from '../constants/http.js';
import UserModel from '../models/user.model.js';
import appAssert from '../utils/appAssert.js';
import catchErrors from '../utils/catchErrors.js';
import { updateUserSchema } from './user.schemas.js';
import { clearAuthCookies } from '../utils/cookies.js';

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, 'User not found');
  return res
    .status(OK)
    .json({ success: true, message: 'User found', data: user.omitPassword() });
});

export const editUserHandler = catchErrors(async (req, res) => {
  const request = updateUserSchema.parse({
    ...req.body,
  });

  const userId = req.userId;

  const updatedUser = await changeUserData({
    request,
    avatarPath: req.file?.path,
    avatarPublicId: req.file?.filename,
    userId,
  });

  return res.status(OK).json({
    success: true,
    message: 'User found',
    data: updatedUser.omitPassword(),
  });
});

export const deleteUserHandler = catchErrors(async (req, res) => {
  const userId = req.userId;

  await deleteUserById(userId);

  return clearAuthCookies(res).status(OK).json({
    success: true,
    message: 'User deleted',
  });
});

export const getTopUsersHandler = catchErrors(async (req, res) => {
  const limit = Number(req.query.limit) || 10;

  const result = await getTopUsers({ limit });

  const users = result.map((item) => item.author);

  res.json({
    success: true,
    message: 'Top users found',
    users,
  });
});
