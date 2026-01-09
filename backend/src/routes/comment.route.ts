import { Router } from 'express';
import authenticate from '../middleware/authentificate.js';
import { setRequestExtensions } from '../middleware/requestExtension.js';
import {
  createCommentHandler,
  deleteCommentHandler,
  editCommentHandler,
} from '../controllers/comment.controller.js';

const commentRoute = Router();

commentRoute.post(
  '/',
  setRequestExtensions,
  authenticate,
  createCommentHandler
);

commentRoute.delete(
  '/:id',
  setRequestExtensions,
  authenticate,
  deleteCommentHandler
);

commentRoute.patch(
  '/:id',
  setRequestExtensions,
  authenticate,
  editCommentHandler
);

export default commentRoute;
