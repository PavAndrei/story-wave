import {
  registerHandler,
  loginHandler,
  logooutHandler,
  refreshHandler,
  verifyEmailHandler,
  sendPasswordResetHandler,
  resetPasswordHandler,
} from '../controllers/auth.controller.js';
import { Router } from 'express';

const authRoutes = Router();

authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/logout', logooutHandler);
authRoutes.get('/email/verify/:code', verifyEmailHandler);

authRoutes.post('/password/forgot', sendPasswordResetHandler);
authRoutes.post('/password/reset', resetPasswordHandler);

export default authRoutes;
