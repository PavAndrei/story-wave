import { Router } from 'express';

import {
  getUserHandler,
  editUserHandler,
  deleteUserHandler,
  getTopUsersHandler,
} from '../controllers/user.controller.js';
import { upload } from '../middleware/uploadImages.js';
import { setRequestExtensions } from '../middleware/requestExtension.js';
import authenticate from '../middleware/authentificate.js';

const userRoutes = Router();

userRoutes.get('/me', setRequestExtensions, authenticate, getUserHandler);
userRoutes.patch(
  '/me/:id',
  setRequestExtensions,
  authenticate,
  upload.single('avatar'),
  editUserHandler
);
userRoutes.delete('/me', setRequestExtensions, authenticate, deleteUserHandler);
userRoutes.get('/top', getTopUsersHandler);

export default userRoutes;
