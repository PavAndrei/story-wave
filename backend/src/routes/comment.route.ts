import { Router } from 'express';
import authenticate from '../middleware/authentificate.js';
import { setRequestExtensions } from '../middleware/requestExtension.js';
import {
  createCommentHandler,
  deleteCommentHandler,
  editCommentHandler,
  getBlogCommentsHandler,
  getUserCommentsHandler,
  toggleCommentLikeHandler,
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

commentRoute.get(
  '/my',
  setRequestExtensions,
  authenticate,
  getUserCommentsHandler
);

commentRoute.patch(
  '/:id/like',
  setRequestExtensions,
  authenticate,
  toggleCommentLikeHandler
);

commentRoute.get('/:id', getBlogCommentsHandler);

export default commentRoute;
