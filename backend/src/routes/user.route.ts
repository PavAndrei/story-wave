import { Router } from 'express';

import {
  getUserHandler,
  editUserHandler,
} from '../controllers/user.controller.js';
import { upload } from '../middleware/uploadImages.js';

const userRoutes = Router();

userRoutes.get('/me', getUserHandler);
userRoutes.patch('/me/:id', upload.single('avatar'), editUserHandler);

export default userRoutes;
