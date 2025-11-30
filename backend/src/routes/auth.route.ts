import {
  registerHandler,
  loginHandler,
  logooutHandler,
} from '../controllers/auth.controller';
import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/logout', logooutHandler);

export default authRoutes;
