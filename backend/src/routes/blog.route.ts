import { Router } from 'express';
import {
  saveBlogHandler,
  getMyBlogsHandler,
  getOneBlogHandler,
  deleteBlogHandler,
  editBlogHandler,
} from '../controllers/blog.controller.js';
import authenticate from '../middleware/authentificate.js';
import { setRequestExtensions } from '../middleware/requestExtension.js';

const blogRoutes = Router();

blogRoutes.post('/', setRequestExtensions, authenticate, saveBlogHandler);
blogRoutes.get('/my', setRequestExtensions, authenticate, getMyBlogsHandler);
blogRoutes.get('/:id', getOneBlogHandler);
blogRoutes.delete(
  '/:id',
  setRequestExtensions,
  authenticate,
  deleteBlogHandler
);
blogRoutes.patch('/:id', setRequestExtensions, authenticate, editBlogHandler);

export default blogRoutes;
