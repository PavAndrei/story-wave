import { Router } from 'express';
import { saveBlog } from '../controllers/blog.controller.js';

const blogRoutes = Router();

blogRoutes.post('/draft', saveBlog);

export default blogRoutes;
