import mongoose from 'mongoose';
import BlogModel from '../models/blog.model.js';
import appAssert from '../utils/appAssert.js';
import { FORBIDDEN, NOT_FOUND } from '../constants/http.js';
import imageModel from '../models/image.model.js';
import { deleteFromCloudinary } from '../utils/cloudinary.js';

type SaveBlogProps = {
  blogId?: string;
  authorId: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  data?: {
    title?: string;
    content?: string;
    categories?: string[];
    coverImgUrl?: string;
    // imagesUrls?: string[];
  };
};

const extractImageUrlsFromContent = (content?: string): string[] => {
  if (!content) return [];

  const regex = /!\[[^\]]*\]\((.*?)\)/g;
  const urls: string[] = [];

  let match;
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
};

export const saveBlogService = async ({
  blogId,
  authorId,
  status,
  data,
}: SaveBlogProps) => {
  let blog;

  /* ================= CREATE OR LOAD ================= */

  if (blogId) {
    blog = await BlogModel.findById(blogId);
    appAssert(blog, NOT_FOUND, 'Blog not found');
    appAssert(blog.authorId.equals(authorId), FORBIDDEN, 'Not your blog');
  } else {
    blog = new BlogModel({
      authorId,
      status: 'draft',
    });
  }

  /* ================= UPDATE FIELDS ================= */

  if (data?.title !== undefined) blog.title = data.title;
  if (data?.content !== undefined) blog.content = data.content;
  if (data?.categories !== undefined) blog.categories = data.categories;
  if (data?.coverImgUrl !== undefined) blog.coverImgUrl = data.coverImgUrl;

  blog.status = status;

  if (status === 'published' && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }

  /* ================= IMAGE SYNC ================= */

  const contentImageUrls = extractImageUrlsFromContent(blog.content);
  const usedUrls = new Set<string>(contentImageUrls);

  if (blog.coverImgUrl) {
    usedUrls.add(blog.coverImgUrl);
  }

  const allImages = await imageModel.find({ blogId: blog._id });

  const unusedImages = allImages.filter((img) => !usedUrls.has(img.url));

  for (const img of unusedImages) {
    await deleteFromCloudinary(img.publicId);
    await img.deleteOne();
  }

  blog.imagesUrls = Array.from(usedUrls);

  /* ================= SAVE ================= */

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
