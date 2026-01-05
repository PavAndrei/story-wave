import mongoose from 'mongoose';
import BlogModel, { BlogDocument } from '../models/blog.model.js';
import appAssert from '../utils/appAssert.js';
import { FORBIDDEN, NOT_FOUND } from '../constants/http.js';
import imageModel from '../models/image.model.js';
import { cloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import UserModel from '../models/user.model.js';

type SaveBlogProps = {
  blogId?: string;
  authorId: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  data?: {
    title?: string;
    content?: string;
    categories?: string[];
    coverImgUrl?: string;
  };
};

const mapBlogToFrontend = async (blog: any) => {
  const images = await imageModel.find({ blogId: blog._id }).lean();

  return {
    ...blog,

    coverImage: blog.coverImgUrl
      ? {
          url: blog.coverImgUrl,
        }
      : null,

    images: images.map((img) => ({
      id: img._id.toString(),
      url: img.url,
    })),
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

  if (data?.title !== undefined) blog.title = data.title;
  if (data?.content !== undefined) blog.content = data.content;
  if (data?.categories !== undefined) blog.categories = data.categories;
  if (data?.coverImgUrl !== undefined) blog.coverImgUrl = data.coverImgUrl;

  await UserModel.findByIdAndUpdate(authorId, {
    $addToSet: { blogs: blog._id },
  });

  blog.status = status;

  if (status === 'published' && !blog.publishedAt) {
    blog.publishedAt = new Date();
  }

  const prevCoverUrl = blog.coverImgUrl ?? null;

  if ('coverImgUrl' in (data ?? {})) {
    blog.coverImgUrl = data!.coverImgUrl ?? null;
  } else {
    blog.coverImgUrl = null;
  }

  const contentImageUrls = extractImageUrlsFromContent(blog.content);
  const usedUrls = new Set<string>(contentImageUrls);

  if (prevCoverUrl && blog.coverImgUrl !== prevCoverUrl) {
    const oldCoverImage = await imageModel.findOne({
      blogId: blog._id,
      url: prevCoverUrl,
    });

    if (oldCoverImage) {
      await deleteFromCloudinary(oldCoverImage.publicId);
      await oldCoverImage.deleteOne();
    }
  }

  const allImages = await imageModel.find({ blogId: blog._id });

  const unusedImages = allImages.filter((img) => !usedUrls.has(img.url));

  for (const img of unusedImages) {
    await deleteFromCloudinary(img.publicId);
    await img.deleteOne();
  }

  blog.imagesUrls = Array.from(usedUrls);

  const contentFieldsChanged =
    data?.title !== undefined ||
    data?.content !== undefined ||
    data?.categories !== undefined ||
    data?.coverImgUrl !== undefined;

  if (contentFieldsChanged) {
    blog.lastEditedAt = new Date();
  }

  await blog.save();

  return await mapBlogToFrontend(blog.toObject());
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

export const deleteBlogById = async (
  blogId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const blog = await BlogModel.findById(blogId).session(session);

    appAssert(blog, NOT_FOUND, 'Blog not found');

    appAssert(blog.authorId.equals(userId), FORBIDDEN, 'Not your blog');

    /* ---------- 1. Collecting images ---------- */
    const images = await imageModel.find({ blogId }).session(session);

    /* ---------- 2. Delete images ---------- */
    for (const image of images) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    /* ---------- 3. Delete image docs ---------- */
    await imageModel.deleteMany({ blogId }).session(session);

    /* ---------- 4. Delete blog ---------- */
    await BlogModel.findByIdAndDelete(blogId).session(session);

    /* ---------- 5. Delete blogId from user ---------- */
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { blogs: blog._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

type GetAllBlogsParams = {
  page: number;
  limit: number;
  sort: 'asc' | 'desc';
  title?: string;
  categories?: string[] | string;
  author?: string;
  userId?: mongoose.Types.ObjectId;
};

export const getAllBlogs = async (filters: GetAllBlogsParams) => {
  const { page, limit, sort, title, categories, author, userId } = filters;

  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {
    status: 'published',
  };

  /* ===== title search ===== */
  if (title) {
    filter.title = {
      $regex: title,
      $options: 'i',
    };
  }

  /* ===== categories filter ===== */
  if (categories) {
    const arr = Array.isArray(categories)
      ? categories
      : categories.split(',').map((c) => c.trim());

    filter.categories = { $in: arr };
  }

  /* ===== author username filter ===== */
  if (author) {
    const user = await UserModel.findOne({
      username: {
        $regex: `^${author}$`,
        $options: 'i',
      },
    }).select('_id');

    if (!user) {
      return {
        blogs: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }

    filter.authorId = user._id;
  }

  const [items, total, user] = await Promise.all([
    BlogModel.find(filter)
      .populate('authorId', 'username')
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    BlogModel.countDocuments(filter),

    userId ? UserModel.findById(userId).select('favorites').lean() : null,
  ]);

  const favoriteSet = new Set(
    user?.favorites?.map((id) => id.toString()) ?? []
  );

  const blogs = items.map((blog) => ({
    ...blog,
    isFavorite: favoriteSet.has(blog._id.toString()),
  }));

  return {
    blogs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const toggleBlogLike = async ({
  blogId,
  userId,
}: {
  blogId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}) => {
  const blog = await BlogModel.findById(blogId);

  appAssert(blog, NOT_FOUND, 'Blog not found');

  const hasLiked = blog.likedBy.some((id) => id.equals(userId));

  if (hasLiked) {
    blog.likedBy = blog.likedBy.filter((id) => !id.equals(userId));
    blog.likesCount = Math.max(blog.likesCount - 1, 0);
  } else {
    blog.likedBy.push(userId);
    blog.likesCount += 1;
  }

  await blog.save();

  return {
    likesCount: blog.likesCount,
    isLiked: !hasLiked,
  };
};

export const toggleBlogFavorite = async ({
  blogId,
  userId,
}: {
  blogId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}) => {
  const blog = await BlogModel.findById(blogId).select('_id');
  appAssert(blog, NOT_FOUND, 'Blog not found');

  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, 'User not found');

  const isFavorite = user.favorites.some((id) => id.equals(blogId));

  if (isFavorite) {
    user.favorites = user.favorites.filter((id) => !id.equals(blogId));
  } else {
    user.favorites.push(blogId);
  }

  await user.save();

  return {
    isFavorite: !isFavorite,
  };
};

type GetFavoriteBlogsParams = {
  userId: mongoose.Types.ObjectId;
  page: number;
  limit: number;
  search?: string;
  categories?: string;
  sort: 'asc' | 'desc';
};

export const getFavoriteBlogs = async ({
  userId,
  page,
  limit,
  search,
  categories,
  sort,
}: GetFavoriteBlogsParams) => {
  const skip = (page - 1) * limit;

  // 1️⃣ Получаем избранные ID пользователя
  const user = await UserModel.findById(userId).select('favorites').lean();

  appAssert(user, NOT_FOUND, 'User not found');

  if (!user.favorites.length) {
    return {
      blogs: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  // 2️⃣ Базовый фильтр
  const filter: Record<string, any> = {
    _id: { $in: user.favorites },
    status: 'published',
  };

  // 3️⃣ Search по title
  if (search) {
    filter.title = {
      $regex: search,
      $options: 'i',
    };
  }

  // 4️⃣ Categories
  if (categories) {
    const arr = categories.split(',').map((c) => c.trim());
    filter.categories = { $in: arr };
  }

  // 5️⃣ Запросы
  const [items, total] = await Promise.all([
    BlogModel.find(filter)
      .populate('authorId', 'username')
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit)
      .lean(),

    BlogModel.countDocuments(filter),
  ]);

  return {
    blogs: items.map((blog) => ({
      ...blog,
      isFavorite: true, // 💡 важно
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const addRecentBlog = async ({
  userId,
  blogId,
  limit = 5,
}: {
  userId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  limit?: number;
}) => {
  const user = await UserModel.findById(userId);
  appAssert(user, NOT_FOUND, 'User not found');

  user.recentBlogs = user.recentBlogs.filter(
    (item) => !item.blogId.equals(blogId)
  );

  user.recentBlogs.unshift({
    blogId,
    viewedAt: new Date(),
  });

  if (user.recentBlogs.length > limit) {
    user.recentBlogs = user.recentBlogs.slice(0, limit);
  }

  await user.save();
};

interface RecentBlogPopulated {
  blogId: BlogDocument;
  viewedAt: Date;
}

type UserRecentLean = {
  recentBlogs: RecentBlogPopulated[];
  favorites: mongoose.Types.ObjectId[];
};

export const getRecentBlogs = async ({
  userId,
  limit = 5,
}: {
  userId: mongoose.Types.ObjectId;
  limit?: number;
}) => {
  const user = await UserModel.findById(userId)
    .select('recentBlogs favorites')
    .populate({
      path: 'recentBlogs.blogId',
      populate: {
        path: 'authorId',
        select: 'username',
      },
    })
    .lean<UserRecentLean>();

  appAssert(user, NOT_FOUND, 'User not found');

  const favoriteSet = new Set(user.favorites?.map((id) => id.toString()) ?? []);

  const blogs = user.recentBlogs
    .filter((item) => item.blogId && item.blogId.status === 'published')
    .slice(0, limit)
    .map((item) => ({
      ...item.blogId,
      viewedAt: item.viewedAt,
      isFavorite: favoriteSet.has(item.blogId._id.toString()),
    }));

  return blogs;
};
