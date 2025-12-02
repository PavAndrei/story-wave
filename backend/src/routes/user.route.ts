import { Router } from 'express';

import { getUserHandler } from '../controllers/user.controller.js';

const userRoutes = Router();

userRoutes.get('/profile', getUserHandler);

export default userRoutes;
