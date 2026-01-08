import { Router } from 'express';
import authenticate from '../middleware/authentificate.js';
import { setRequestExtensions } from '../middleware/requestExtension.js';
import { createCommentController } from '../controllers/comment.controller.js';

const commentRoute = Router();

commentRoute.post(
  '/',
  setRequestExtensions,
  authenticate,
  createCommentController
);

export default commentRoute;
