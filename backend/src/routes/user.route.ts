import { Router } from 'express';

import { getUserHandler } from '../controllers/user.controller.js';

const userRoutes = Router();

userRoutes.get('/me', getUserHandler);

export default userRoutes;
