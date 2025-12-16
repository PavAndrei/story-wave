import { Router } from 'express';

import { uploadPostImagesHandler } from '../controllers/upload.controller.js';

const uploadRoutes = Router();

uploadRoutes.post('/images', uploadPostImagesHandler);

export default uploadRoutes;
