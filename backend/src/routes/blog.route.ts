import { Router } from 'express';
import {
  saveBlogHandler,
  getMyBlogsHandler,
  getOneBlogHandler,
  deleteBlogHandler,
  getAllBlogsHandler,
} from '../controllers/blog.controller.js';
import authenticate from '../middleware/authentificate.js';
import { setRequestExtensions } from '../middleware/requestExtension.js';

const blogRoutes = Router();

blogRoutes.post('/', setRequestExtensions, authenticate, saveBlogHandler);
blogRoutes.get('/', getAllBlogsHandler);
blogRoutes.get('/my', setRequestExtensions, authenticate, getMyBlogsHandler);
blogRoutes.get('/:id', getOneBlogHandler);
blogRoutes.delete(
  '/:id',
  setRequestExtensions,
  authenticate,
  deleteBlogHandler
);

export default blogRoutes;
