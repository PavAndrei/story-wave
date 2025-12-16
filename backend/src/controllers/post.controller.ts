import mongoose from 'mongoose';
import { CREATED, OK } from '../constants/http.js';
import {
  archivePost,
  createPost,
  editPost,
  getSinglePost,
  publishPost,
} from '../services/post.service.js';
import catchErrors from '../utils/catchErrors.js';
import {
  createPostSchema,
  editPostSchema,
  postIdSchema,
} from './post.schemas.js';

export const createPostHandler = catchErrors(async (req, res) => {
  const request = createPostSchema.parse(req.body);

  const result = await createPost(request, req.userId);

  return res.status(CREATED).json({
    success: true,
    message: 'Post created successfully',
    data: result,
  });
});

export const editPostHandler = catchErrors(async (req, res) => {
  const parsed = editPostSchema.parse(req.body);

  const authorId = req.userId;

  const updatedPost = await editPost(
    req.params.id,
    new mongoose.Types.ObjectId(authorId),
    parsed
  );

  return res.status(OK).json({
    success: true,
    message: 'Post edited successfully',
    data: updatedPost,
  });
});

export const getSinglePostHandler = catchErrors(async (req, res) => {
  const { id } = postIdSchema.parse(req.params);

  const viewerId = req.userId
    ? new mongoose.Types.ObjectId(req.userId)
    : undefined;

  const post = await getSinglePost(id, viewerId);

  return res.status(OK).json({
    success: true,
    message: 'Post found',
    data: post,
  });
});

export const publishPostHandler = catchErrors(async (req, res) => {
  const authorId = req.userId;

  const post = await publishPost(
    req.params.id,
    new mongoose.Types.ObjectId(authorId)
  );

  return res.status(OK).json({
    success: true,
    message: 'Post published successfully',
    data: post,
  });
});

export const archivePostHandler = catchErrors(async (req, res) => {
  const authorId = req.userId;

  const post = await archivePost(
    req.params.id,
    new mongoose.Types.ObjectId(authorId)
  );

  return res.status(OK).json({
    success: true,
    message: 'Post archived successfully',
    data: post,
  });
});

export const deletePostHandler = catchErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Post deleted successfully',
  });
});

export const getMyDraftsHandler = catchErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'My drafts received successfully',
  });
});

export const getMyPostsHandler = catchErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'My published posts received successfully',
  });
});

export const getAllPostsHandler = catchErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'My published posts received successfully',
  });
});
