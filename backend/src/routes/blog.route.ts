import { Router } from 'express';
import {
  saveBlogHandler,
  getMyBlogsHandler,
} from '../controllers/blog.controller.js';
import authenticate from '../middleware/authentificate.js';

const blogRoutes = Router();

blogRoutes.post('/', saveBlogHandler);
blogRoutes.get('/my', authenticate, getMyBlogsHandler);

export default blogRoutes;
