import { BAD_REQUEST, OK } from '../constants/http.js';
import mongoose from 'mongoose';
import catchErrors from '../utils/catchErrors.js';
import {
  getMyBlogsService,
  saveBlogService,
} from '../services/blog.service.js';
import appAssert from '../utils/appAssert.js';
import { draftSchema, publishSchema } from './blog.schemas.js';
import BlogModel from '../models/blog.model.js';

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
    blog: {
      _id: blog._id,
      status: blog.status,
    },
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
  const blog = await BlogModel.findById(id);
  appAssert(blog, BAD_REQUEST, 'Blog not found');
  return res.status(OK).json({
    success: true,
    message: 'Blog found',
    blog,
  });
});
