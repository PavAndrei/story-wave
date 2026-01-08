import { Router } from 'express';
import authenticate from '../middleware/authentificate.js';
import { setRequestExtensions } from '../middleware/requestExtension.js';
import {
  createCommentHandler,
  deleteCommentHandler,
} from '../controllers/comment.controller.js';

const commentRoute = Router();

commentRoute.post(
  '/',
  setRequestExtensions,
  authenticate,
  createCommentHandler
);

commentRoute.delete(
  '/:commentId',
  setRequestExtensions,
  authenticate,
  deleteCommentHandler
);

export default commentRoute;
