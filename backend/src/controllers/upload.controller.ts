import type { Request, Response } from 'express';
import { OK, FORBIDDEN, NOT_FOUND } from '../constants/http.js';
import appAssert from '../utils/appAssert.js';
import ImageModel from '../models/image.model.js';
import PostModel from '../models/blog.model.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

export const uploadImagesHandler = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { postId } = req.params;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const post = await PostModel.findById(postId);
  if (!post) return res.status(400).json({ message: 'Post not found' });

  if (post.status !== 'draft') {
    return res
      .status(400)
      .json({ message: 'Images can be uploaded only to draft posts' });
  }

  const images = await ImageModel.insertMany(
    files.map((file: any) => ({
      postId: post._id,
      url: file.path,
      publicId: file.filename,
    }))
  );

  post.imagesUrls.push(...images.map((img) => img.url));
  await post.save();

  return res.status(200).json({
    success: true,
    data: images.map((img) => img.url),
  });
};

export const deletePostImageHandler = async (req: Request, res: Response) => {
  const image = await ImageModel.findById(req.params.id);
  appAssert(image, NOT_FOUND, 'Image not found');

  const post = await PostModel.findById(image.postId);
  appAssert(post, NOT_FOUND, 'Post not found');
  appAssert(post.authorId.equals(req.userId), FORBIDDEN, 'Not your post');

  // удаляем из Cloudinary по publicId
  await deleteFromCloudinary(image.publicId);

  await image.deleteOne();

  post.imagesUrls = post.imagesUrls.filter((url) => url !== image.url);
  await post.save();

  return res.status(OK).json({ success: true });
};
