import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import type { Request } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
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
