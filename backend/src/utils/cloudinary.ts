import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import type { Request } from 'express';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from '../constants/env.js';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file) => {
    const fileType = file.mimetype.split('/')[1];

    let folder = 'images';

    if (file.fieldname === 'avatar') {
      folder = 'avatars';
    }

    if (file.fieldname === 'gallery') {
      folder = 'gallery';
    }

    return {
      folder,
      format: ['jpeg', 'png', 'jpg'].includes(fileType) ? fileType : 'png',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

export { cloudinary, storage };
