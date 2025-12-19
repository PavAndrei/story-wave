import type { Request, Response } from 'express';
import { OK, FORBIDDEN, NOT_FOUND } from '../constants/http.js';
import appAssert from '../utils/appAssert.js';
import ImageModel from '../models/image.model.js';
import BlogModel from '../models/blog.model.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

export const uploadImagesHandler = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { postId } = req.params;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const post = await BlogModel.findById(postId);
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (post.status !== 'draft') {
    return res
      .status(400)
      .json({ message: 'Images can be uploaded only to draft posts' });
  }

  const images = await ImageModel.insertMany(
    files.map((file) => ({
      postId: post._id,
      url: file.path,
      publicId: file.filename,
    }))
  );

  post.imagesUrls.push(...images.map((img) => img.url));
  await post.save();

  return res.status(200).json({
    success: true,
    data: images.map((img) => ({
      id: img._id,
      url: img.url,
    })),
  });
};

export const deletePostImageHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  const image = await ImageModel.findById(id);
  appAssert(image, NOT_FOUND, 'Image not found');

  const blog = await BlogModel.findById(image.postId);
  appAssert(blog, NOT_FOUND, 'Post not found');

  appAssert(blog.authorId.equals(req.userId), FORBIDDEN, 'Not your blog');

  // 1. Удаляем из Cloudinary
  await deleteFromCloudinary(image.publicId);

  // 2. Удаляем из БД images
  await image.deleteOne();

  // 3. Удаляем ссылку из blog
  blog.imagesUrls = blog.imagesUrls.filter((url) => url !== image.url);

  await blog.save();

  return res.status(200).json({ success: true });
};
