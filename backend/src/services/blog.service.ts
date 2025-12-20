import mongoose from 'mongoose';
import BlogModel from '../models/blog.model.js';
import appAssert from '../utils/appAssert.js';
import { NOT_FOUND } from '../constants/http.js';

// export const editPost = async (
//   postId: string,
//   authorId: mongoose.Types.ObjectId,
//   update: EditPostSchemaValues
// ) => {
//   const post = await PostModel.findById(postId);
//   appAssert(post, NOT_FOUND, 'Post not found');

//   const isPostDeleted = post.isDeleted;

//   appAssert(!isPostDeleted, NOT_FOUND, 'Post deleted');

//   appAssert(
//     post.authorId.equals(authorId),
//     FORBIDDEN,
//     'You are allowed to edit only your own posts'
//   );

//   if (update.title !== undefined) post.title = update.title;
//   if (update.content !== undefined) post.content = update.content;
//   if (update.categories !== undefined) post.categories = update.categories;
//   if (update.coverImgUrl !== undefined) post.coverImgUrl = update.coverImgUrl;
//   if (update.imagesUrls !== undefined) post.imagesUrls = update.imagesUrls;

//   await post.save();

//   return post;
// };

// export const archivePost = async (
//   postId: string,
//   authorId: mongoose.Types.ObjectId
// ) => {
//   const post = await PostModel.findById(postId);
//   appAssert(post, NOT_FOUND, 'Post not found');

//   appAssert(!post.isDeleted, NOT_FOUND, 'Post deleted');

//   appAssert(
//     post.authorId.equals(authorId),
//     FORBIDDEN,
//     'You are allowed to archive only your own posts'
//   );

//   appAssert(
//     post.status === 'published',
//     BAD_REQUEST,
//     'Only published posts can be archived'
//   );

//   post.status = 'archived';

//   await post.save();

//   return post;
// };

// export const getSinglePost = async (
//   postId: string,
//   viewerId?: mongoose.Types.ObjectId
// ) => {
//   const post = await PostModel.findById(postId);
//   appAssert(post, NOT_FOUND, 'Post not found');

//   appAssert(!post.isDeleted, NOT_FOUND, 'Post not found');

//   if (post.status === 'published') {
//     return post;
//   }

//   appAssert(
//     viewerId && post.authorId.equals(viewerId),
//     FORBIDDEN,
//     'You are not allowed to view this post'
//   );

//   return post;
// };

// export const deletePost = async (
//   postId: string,
//   authorId: mongoose.Types.ObjectId
// ) => {
//   const post = await PostModel.findById(postId);
//   appAssert(post, NOT_FOUND, 'Post not found');
//   appAssert(!post.isDeleted, NOT_FOUND, 'Post already deleted');
//   appAssert(
//     post.authorId.equals(authorId),
//     FORBIDDEN,
//     'You are allowed to delete only your own posts'
//   );

//   post.isDeleted = true;

//   const images = await ImageModel.find({ postId: post._id });

//   // удаляем все изображения из Cloudinary
//   for (const img of images) {
//     await deleteFromCloudinary(img.publicId);
//   }

//   await ImageModel.deleteMany({ postId: post._id });
//   await post.save();

//   return post;
// };

// export const getAllPosts = async (
//   page: number,
//   limit: number,
//   search?: string,
//   category?: string
// ) => {
//   const skip = (page - 1) * limit;

//   const filter: Record<string, any> = {
//     status: 'published',
//     isDeleted: false,
//   };

//   if (search) {
//     filter.$or = [
//       { title: { $regex: search, $options: 'i' } },
//       { content: { $regex: search, $options: 'i' } },
//     ];
//   }

//   if (category) {
//     filter.categories = category;
//   }

//   const [items, total] = await Promise.all([
//     PostModel.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit),
//     PostModel.countDocuments(filter),
//   ]);

//   return {
//     items,
//     pagination: {
//       page,
//       limit,
//       total,
//       pages: Math.ceil(total / limit),
//     },
//   };
// };
type SaveBlogProps = {
  postId?: string;
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
  postId,
  authorId,
  status,
  data,
}: SaveBlogProps) => {
  if (postId) {
    const blog = await BlogModel.findOneAndUpdate(
      { _id: postId, authorId },
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

type GetMyBlogsFilters = {
  status?: 'draft' | 'published' | 'archived';
  sort?: 'newest' | 'oldest';
  search?: string;
  categories?: string[];
};

type GetMyBlogsServiceProps = {
  authorId: mongoose.Types.ObjectId;
  filters?: GetMyBlogsFilters;
};
export const getMyBlogsService = async ({
  authorId,
  filters = {},
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

  const sortBy = filters.sort === 'oldest' ? 1 : -1;

  const blogs = await BlogModel.find(query)
    .sort({ createdAt: sortBy })
    .select(
      'title status createdAt updatedAt publishedAt coverImgUrl categories'
    )
    .lean();

  return blogs;
};
