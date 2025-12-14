import { changeUserData } from '../services/user.service.js';
import { NOT_FOUND, OK } from '../constants/http.js';
import UserModel from '../models/user.model.js';
import appAssert from '../utils/appAssert.js';
import catchErrors from '../utils/catchErrors.js';
import { updateUserSchema } from './user.schemas.js';

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, 'User not found');
  return res
    .status(OK)
    .json({ success: true, message: 'User found', data: user.omitPassword() });
});

export const editUserHandler = catchErrors(async (req, res) => {
  // validation
  const request = updateUserSchema.parse(req.body);

  const userId = req.userId;

  // service
  const updatedUser = await changeUserData({
    request,
    avatarPath: req.file?.path,
    userId,
  });

  return res.status(OK).json({
    success: true,
    message: 'User found',
    data: updatedUser.omitPassword(),
  });
});
