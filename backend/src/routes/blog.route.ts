import { Router } from 'express';
import { createDraftBlog } from '../controllers/blog.controller.js';

const blogRoutes = Router();

blogRoutes.post('/draft', createDraftBlog);

export default blogRoutes;
