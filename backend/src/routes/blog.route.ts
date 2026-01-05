import { Router } from 'express';
import {
  saveBlogHandler,
  getMyBlogsHandler,
  getOneBlogHandler,
  deleteBlogHandler,
  getAllBlogsHandler,
  toggleLikeHandler,
  viewBlogHandler,
  toggleFavoriteHandler,
  getFavoriteBlogsHandler,
} from '../controllers/blog.controller.js';
import authenticate from '../middleware/authentificate.js';
import { setRequestExtensions } from '../middleware/requestExtension.js';

const blogRoutes = Router();

blogRoutes.post('/', setRequestExtensions, authenticate, saveBlogHandler);
blogRoutes.get('/public', getAllBlogsHandler);
blogRoutes.get(
  '/favorites',
  setRequestExtensions,
  authenticate,
  getFavoriteBlogsHandler
);

blogRoutes.get('/my', setRequestExtensions, authenticate, getMyBlogsHandler);
blogRoutes.get('/:id', getOneBlogHandler);
blogRoutes.delete(
  '/:id',
  setRequestExtensions,
  authenticate,
  deleteBlogHandler
);
blogRoutes.post(
  '/:id/like',
  setRequestExtensions,
  authenticate,
  toggleLikeHandler
);
blogRoutes.post('/:id/view', viewBlogHandler);

blogRoutes.post(
  '/:id/favorite',
  setRequestExtensions,
  authenticate,
  toggleFavoriteHandler
);

export default blogRoutes;
