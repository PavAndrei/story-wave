import mongoose from 'mongoose';
import BlogModel from '../models/blog.model.js';
import appAssert from '../utils/appAssert.js';
import { NOT_FOUND } from '../constants/http.js';

type SaveBlogProps = {
  blogId?: string;
  authorId: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  data?: {
    title?: string;
    content?: string;
    categories?: string[];
    coverImgUrl?: string;
    imagesUrls?: string[];
  };
};
export const saveBlogService = async ({
  blogId,
  authorId,
  status,
  data,
}: SaveBlogProps) => {
  if (blogId) {
    const blog = await BlogModel.findOneAndUpdate(
      { _id: blogId, authorId },
      {
        ...data,
        status,
        ...(status === 'published' ? { publishedAt: new Date() } : {}),
      },
      { new: true }
    );

    appAssert(blog, NOT_FOUND, 'Post not found');

    return blog;
  }

  const blog = new BlogModel({
    authorId,
    ...data,
    status,
    ...(status === 'published' ? { publishedAt: new Date() } : {}),
  });

  await blog.save();
  return blog;
};

type GetMyBlogsServiceProps = {
  authorId: mongoose.Types.ObjectId;
  filters?: {
    status?: 'draft' | 'published' | 'archived';
    sort?: 'newest' | 'oldest';
    search?: string;
    categories?: string[];
  };
  pagination: {
    page: number;
    limit: number;
  };
};
export const getMyBlogsService = async ({
  authorId,
  filters = {},
  pagination,
}: GetMyBlogsServiceProps) => {
  const query: Record<string, any> = {
    authorId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.title = {
      $regex: filters.search,
      $options: 'i',
    };
  }

  if (filters.categories && filters.categories.length > 0) {
    query.categories = {
      $in: filters.categories,
    };
  }

  const sortDirection = filters.sort === 'oldest' ? 1 : -1;

  const skip = (pagination.page - 1) * pagination.limit;

  // 🔹 Параллельные запросы (важно)
  const [blogs, total] = await Promise.all([
    BlogModel.find(query)
      .sort({ createdAt: sortDirection })
      .skip(skip)
      .limit(pagination.limit)
      .select(
        'title status createdAt updatedAt publishedAt coverImgUrl categories'
      )
      .lean(),

    BlogModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / pagination.limit);

  return {
    blogs,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
    },
  };
};
