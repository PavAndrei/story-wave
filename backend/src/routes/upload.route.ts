import { Router } from 'express';

import {
  uploadImagesHandler,
  deletePostImageHandler,
} from '../controllers/upload.controller.js';
import { upload } from '../middleware/uploadImages.js';

const uploadRoutes = Router();

uploadRoutes.post(
  '/images/:postId',
  upload.array('images', 10),
  uploadImagesHandler
);

uploadRoutes.delete('/images/:id', deletePostImageHandler);

export default uploadRoutes;
