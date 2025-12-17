import { Router } from 'express';

import { uploadPostImagesHandler } from '../controllers/upload.controller.js';
import { upload } from '../middleware/uploadImages.js';

const uploadRoutes = Router();

uploadRoutes.post(
  '/images',
  upload.array('images', 10),
  uploadPostImagesHandler
);

export default uploadRoutes;
