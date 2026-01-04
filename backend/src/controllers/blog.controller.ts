import { BAD_REQUEST, OK } from '../constants/http.js';
import mongoose from 'mongoose';
import catchErrors from '../utils/catchErrors.js';
import {
  deleteBlogById,
  getAllBlogs,
  getMyBlogsService,
  saveBlogService,
  toggleBlogFavorite,
  toggleBlogLike,
} from '../services/blog.service.js';
import appAssert from '../utils/appAssert.js';
import { draftSchema, publishSchema } from './blog.schemas.js';
import BlogModel from '../models/blog.model.js';
import { verifyToken } from '../utils/jwt.js';

export const saveBlogHandler = catchErrors(async (req, res) => {
  const authorId = req.userId!;
  const { status, blogId } = req.body;

  appAssert(status, BAD_REQUEST, 'Status is required');

  let data;

  if (status === 'draft') {
    data = draftSchema.parse({
      ...req.body,
      coverImgUrl: req.body.coverImgUrl ?? undefined,
    });
  }

  if (status === 'published') {
    data = publishSchema.parse(req.body);
  }

  const blog = await saveBlogService({
    blogId,
    authorId: new mongoose.Types.ObjectId(authorId),
    status,
    data,
  });

  return res.status(OK).json({
    success: true,
    blog,
  });
});

export const getMyBlogsHandler = catchErrors(async (req, res) => {
  const authorId = req.userId!;

  const {
    status,
    sort = 'newest',
    search,
    categories,
    page = '1',
    limit = '10',
  } = req.query;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);

  const result = await getMyBlogsService({
    authorId: new mongoose.Types.ObjectId(authorId),
    filters: {
      status: status as 'draft' | 'published' | 'archived' | undefined,
      sort: sort as 'newest' | 'oldest',
      search: search as string | undefined,
      categories:
        typeof categories === 'string'
          ? categories.split(',').filter(Boolean)
          : undefined,
    },
    pagination: {
      page: pageNumber,
      limit: limitNumber,
    },
  });

  return res.status(OK).json({
    success: true,
    message: 'Blogs received successfully',
    blogs: result.blogs,
    pagination: result.pagination,
  });
});

export const getOneBlogHandler = catchErrors(async (req, res) => {
  const { id } = req.params;

  const accessToken = req.cookies.accessToken;

  const blog = await BlogModel.findById(id).lean();
  appAssert(blog, BAD_REQUEST, 'Blog not found');

  let isLiked;

  const { payload } = verifyToken(accessToken || '');

  if (payload) {
    isLiked = blog.likedBy.some((id) => id.equals(payload.userId));
  }

  return res.status(OK).json({
    success: true,
    message: 'Blog found',
    blog: {
      ...blog,
      isLiked,
    },
  });
});

export const deleteBlogHandler = catchErrors(async (req, res) => {
  const blogId = req.params.id;
  const userId = req.userId!;

  await deleteBlogById(
    new mongoose.Types.ObjectId(blogId),
    new mongoose.Types.ObjectId(userId)
  );

  return res.status(OK).json({ success: true, message: 'Blog deleted' });
});

export const getAllBlogsHandler = catchErrors(async (req, res) => {
  const {
    page = '1',
    limit = '10',
    sort = 'newest',
    search,
    categories,
    author,
  } = req.query;

  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken || '');

  let userId;

  if (payload) {
    userId = payload.userId;
  }

  const result = await getAllBlogs({
    page: Number(page),
    limit: Number(limit),
    sort: sort === 'oldest' ? 'asc' : 'desc',
    title: search as string | undefined,
    categories: categories as string | undefined,
    author: author as string | undefined,
    userId,
  });

  return res.status(OK).json({
    success: true,
    blogs: result.blogs,
    pagination: result.pagination,
  });
});

export const toggleLikeHandler = catchErrors(async (req, res) => {
  const userId = req.userId!;
  const { id: blogId } = req.params;

  const result = await toggleBlogLike({
    blogId: new mongoose.Types.ObjectId(blogId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  return res.status(OK).json({
    success: true,
    message: 'Like toggled successfully',
    data: {
      isLiked: result.isLiked,
      likesCount: result.likesCount,
    },
  });
});

export const viewBlogHandler = catchErrors(async (req, res) => {
  const { id } = req.params;

  await BlogModel.findByIdAndUpdate(id, {
    $inc: { viewsCount: 1 },
  });

  res.status(OK).json({ success: true, message: 'Blog viewed' });
});

export const toggleFavoriteHandler = catchErrors(async (req, res) => {
  const userId = req.userId!;
  const { id: blogId } = req.params;

  const result = await toggleBlogFavorite({
    blogId: new mongoose.Types.ObjectId(blogId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  return res.status(OK).json({
    success: true,
    message: 'Favorite toggled successfully',
    data: {
      isFavorite: result.isFavorite,
    },
  });
});
