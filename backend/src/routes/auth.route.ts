import { registerHandler } from '../controllers/auth.controller';
import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', registerHandler);

export default authRoutes;
