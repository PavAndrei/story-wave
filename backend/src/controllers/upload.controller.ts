import type { Request, Response } from 'express';
import ImageModel from '../models/image.model.js';
import BlogModel from '../models/blog.model.js';

export const uploadImagesHandler = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { blogId } = req.params;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const blog = await BlogModel.findById(blogId);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (blog.status !== 'draft') {
    return res
      .status(400)
      .json({ message: 'Images can be uploaded only to draft posts' });
  }

  const images = await ImageModel.insertMany(
    files.map((file) => ({
      blogId: blog._id,
      url: file.path,
      publicId: file.filename,
    }))
  );

  blog.imagesUrls.push(...images.map((img) => img.url));
  await blog.save();

  return res.status(200).json({
    success: true,
    data: images.map((img) => ({
      id: img._id,
      url: img.url,
    })),
  });
};
