import type { Request, Response } from 'express';
import { OK, BAD_REQUEST } from '../constants/http.js';
import appAssert from '../utils/appAssert.js';

export const uploadPostImagesHandler = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[] | undefined;

  appAssert(files && files.length > 0, BAD_REQUEST, 'No files uploaded');

  const urls = files.map((file) => {
    // multer-storage-cloudinary url
    return (file as any).path;
  });

  return res.status(OK).json({
    success: true,
    message: 'Files uploaded successfully',
    data: urls,
  });
};
