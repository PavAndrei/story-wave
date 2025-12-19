// import mongoose from 'mongoose';
// import { CREATED, OK } from '../constants/http.js';
// import {
//   archivePost,
//   createPost,
//   deletePost,
//   editPost,
//   getAllPosts,
//   getMyDrafts,
//   getMyPublishedPosts,
//   getSinglePost,
//   publishPost,
//   createDraftPost,
// } from '../services/post.service.js';
// import catchErrors from '../utils/catchErrors.js';
// import {
//   createPostSchema,
//   deletePostSchema,
//   editPostSchema,
//   getAllPostsSchema,
//   getMyDraftsSchema,
//   getMyPublishedPostsSchema,
//   postIdSchema,
// } from './post.schemas.js';

import { BAD_REQUEST, OK } from '../constants/http.js';
import mongoose from 'mongoose';
import catchErrors from '../utils/catchErrors.js';
import { createBlog } from '../services/blog.service.js';
import appAssert from '../utils/appAssert.js';
import { draftSchema, publishSchema } from './blog.schemas.js';

// export const createDraftPostHandler = catchErrors(async (req, res) => {
//   const authorId = req.userId;

//   const post = await createDraftPost(new mongoose.Types.ObjectId(authorId));

//   return res.status(CREATED).json({
//     success: true,
//     data: post,
//   });
// });

// export const createPostHandler = catchErrors(async (req, res) => {
//   const request = createPostSchema.parse(req.body);

//   const result = await createPost(request, req.userId);

//   return res.status(CREATED).json({
//     success: true,
//     message: 'Post created successfully',
//     data: result,
//   });
// });

// export const editPostHandler = catchErrors(async (req, res) => {
//   const parsed = editPostSchema.parse(req.body);

//   const authorId = req.userId;

//   const updatedPost = await editPost(
//     req.params.id,
//     new mongoose.Types.ObjectId(authorId),
//     parsed
//   );

//   return res.status(OK).json({
//     success: true,
//     message: 'Post edited successfully',
//     data: updatedPost,
//   });
// });

// export const getSinglePostHandler = catchErrors(async (req, res) => {
//   const { id } = postIdSchema.parse(req.params);

//   const viewerId = req.userId
//     ? new mongoose.Types.ObjectId(req.userId)
//     : undefined;

//   const post = await getSinglePost(id, viewerId);

//   return res.status(OK).json({
//     success: true,
//     message: 'Post found',
//     data: post,
//   });
// });

// export const publishPostHandler = catchErrors(async (req, res) => {
//   const authorId = req.userId;

//   const post = await publishPost(
//     req.params.id,
//     new mongoose.Types.ObjectId(authorId)
//   );

//   return res.status(OK).json({
//     success: true,
//     message: 'Post published successfully',
//     data: post,
//   });
// });

// export const archivePostHandler = catchErrors(async (req, res) => {
//   const authorId = req.userId;

//   const post = await archivePost(
//     req.params.id,
//     new mongoose.Types.ObjectId(authorId)
//   );

//   return res.status(OK).json({
//     success: true,
//     message: 'Post archived successfully',
//     data: post,
//   });
// });

// export const deletePostHandler = catchErrors(async (req, res) => {
//   const { id } = deletePostSchema.parse(req.params);

//   const authorId = new mongoose.Types.ObjectId(req.userId);

//   const post = await deletePost(id, authorId);

//   return res.status(OK).json({
//     success: true,
//     message: 'Post deleted successfully',
//     data: post,
//   });
// });

// export const getMyDraftsHandler = catchErrors(async (req, res) => {
//   const { page, limit } = getMyDraftsSchema.parse(req.query);

//   const authorId = new mongoose.Types.ObjectId(req.userId);

//   const result = await getMyDrafts(authorId, page, limit);

//   return res.status(OK).json({
//     success: true,
//     message: 'My drafts received successfully',
//     data: result,
//   });
// });

// export const getMyPostsHandler = catchErrors(async (req, res) => {
//   const { page, limit } = getMyPublishedPostsSchema.parse(req.query);

//   const authorId = new mongoose.Types.ObjectId(req.userId);

//   const result = await getMyPublishedPosts(authorId, page, limit);

//   return res.status(OK).json({
//     success: true,
//     message: 'My published posts received successfully',
//     data: result,
//   });
// });

// export const getAllPostsHandler = catchErrors(async (req, res) => {
//   const { page, limit, search, category } = getAllPostsSchema.parse(req.query);

//   const result = await getAllPosts(page, limit, search, category);

//   return res.status(OK).json({
//     success: true,
//     data: result,
//     message: 'My published posts received successfully',
//   });
// });

export const createDraftBlog = catchErrors(async (req, res) => {
  const authorId = req.userId;
  const status = req.body.status;
  appAssert(
    status !== 'draft' || status !== 'published',
    BAD_REQUEST,
    'Status is invalid'
  );

  let data;

  if (status === 'draft') {
    data = draftSchema.parse(req.body);
  }

  if (status === 'published') {
    data = publishSchema.parse(req.body);
  }

  const newBlogDate = {
    ...data,
    status,
    authorId: new mongoose.Types.ObjectId(authorId),
  };

  const blog = await createBlog(newBlogDate);

  return res.status(OK).json({
    success: true,
    message: 'Blog created successfully',
    blog: blog,
  });
});
