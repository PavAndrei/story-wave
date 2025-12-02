import { Router } from 'express';

import { getUserHandler } from '../controllers/user.controller';

const userRoutes = Router();

userRoutes.get('/profile', getUserHandler);

export default userRoutes;
