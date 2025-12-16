import PostModel from '../models/post.model.js';
import mongoose from 'mongoose';
import {
  CreatePostSchemaValues,
  EditPostSchemaValues,
} from '../controllers/post.schemas.js';
import { NOT_FOUND } from '../constants/http.js';
import appAssert from '../utils/appAssert.js';

export const createPost = async (
  req: CreatePostSchemaValues,
  authorId: mongoose.Types.ObjectId | undefined
) => {
  if (!authorId) {
    return null;
  }

  const post = await new PostModel({
    authorId: authorId,
    title: req.title,
    content: req.content,
    categories: req.categories ?? [],
    coverImgUrl: req.coverImgUrl ?? '',
    imagesUrls: req.imagesUrls ?? [],
    status: 'draft',
  });

  await post.save();

  return post;
};

export const editPost = async (
  postId: string,
  authorId: mongoose.Types.ObjectId,
  update: EditPostSchemaValues
) => {
  const post = await PostModel.findById(postId);
  appAssert(post, NOT_FOUND, 'Post not found');

  const isPostDeleted = post.isDeleted;

  appAssert(!isPostDeleted, NOT_FOUND, 'Post deleted');

  appAssert(
    post.authorId.equals(authorId),
    NOT_FOUND,
    'You are allowed to edit only your own posts'
  );

  if (update.title !== undefined) post.title = update.title;
  if (update.content !== undefined) post.content = update.content;
  if (update.categories !== undefined) post.categories = update.categories;
  if (update.coverImgUrl !== undefined) post.coverImgUrl = update.coverImgUrl;
  if (update.imagesUrls !== undefined) post.imagesUrls = update.imagesUrls;

  await post.save();

  return post;
};
