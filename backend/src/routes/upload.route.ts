import { Router } from 'express';
import { uploadImagesHandler } from '../controllers/upload.controller.js';
import { upload } from '../middleware/uploadImages.js';

const uploadRoutes = Router();

uploadRoutes.post(
  '/images/:blogId',
  upload.array('images', 10),
  uploadImagesHandler
);

export default uploadRoutes;
