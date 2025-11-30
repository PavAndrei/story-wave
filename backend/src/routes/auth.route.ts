import {
  registerHandler,
  loginHandler,
  logooutHandler,
  refreshHandler,
} from '../controllers/auth.controller';
import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/logout', logooutHandler);

export default authRoutes;
