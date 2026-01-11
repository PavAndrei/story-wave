import { CONFLICT, FORBIDDEN, NOT_FOUND } from '../constants/http.js';
import CommentModel from '../models/comment.model.js';
import mongoose from 'mongoose';
import appAssert from '../utils/appAssert.js';

const mapCommentWithAuthorAndBlog = (comment: any) => ({
  _id: comment._id,
  content: comment.content,
  createdAt: comment.createdAt,
  level: comment.level,

  parentCommentId: comment.parentCommentId ?? null,
  rootCommentId: comment.rootCommentId ?? null,
  replyToUserId: comment.replyToUserId ?? null,

  author: comment.authorId
    ? {
        _id: comment.authorId._id,
        username: comment.authorId.username,
        avatarUrl: comment.authorId.avatarUrl,
      }
    : null,

  blog: comment.blogId
    ? {
        _id: comment.blogId._id,
        title: comment.blogId.title,
      }
    : null,
});

type CreateCommentParams = {
  authorId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  content: string;

  parentCommentId?: string;
  replyToUserId?: mongoose.Types.ObjectId;
};

export const createComment = async ({
  authorId,
  blogId,
  content,
  parentCommentId,
  replyToUserId,
}: CreateCommentParams) => {
  let level: 0 | 1 = 0;
  let rootCommentId: mongoose.Types.ObjectId | null = null;

  if (parentCommentId) {
    const parentComment = await CommentModel.findById(parentCommentId);
    appAssert(parentComment, NOT_FOUND, 'Parent comment not found');
    appAssert(
      parentComment.level < 1,
      CONFLICT,
      'Maximum comment nesting level reached'
    );

    level = 1;
    rootCommentId = parentComment.rootCommentId ?? parentComment._id;
  }

  const comment = await CommentModel.create({
    authorId,
    blogId,
    content,

    level,
    parentCommentId: parentCommentId ?? null,
    rootCommentId,

    replyToUserId: replyToUserId ?? null,
  });

  return comment;
};

export const deleteComment = async ({
  commentId,
  authorId,
}: {
  commentId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
}) => {
  console.log(commentId);
  const comment = await CommentModel.findById(commentId);
  appAssert(comment, NOT_FOUND, 'Comment not found');

  appAssert(
    comment.authorId.toString() === authorId.toString(),
    FORBIDDEN,
    'You can delete only your own comments'
  );

  if (comment.level === 0) {
    await CommentModel.deleteMany({
      rootCommentId: comment._id,
    });
  }

  await CommentModel.deleteOne({ _id: comment._id });
};

type CommentPopulated = {
  _id: mongoose.Types.ObjectId;
  content: string;

  authorId: {
    _id: mongoose.Types.ObjectId;
    username: string;
    avatarUrl?: string;
  };
  blogId: {
    _id: mongoose.Types.ObjectId;
    title: string;
  };

  level: 0 | 1;
  parentCommentId: mongoose.Types.ObjectId | null;
  rootCommentId: mongoose.Types.ObjectId | null;
  replyToUserId: mongoose.Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
};

export const editComment = async ({
  commentId,
  authorId,
  content,
}: {
  commentId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
}) => {
  // 1️⃣ Проверяем существование и права
  const comment = await CommentModel.findById(commentId);
  appAssert(comment, NOT_FOUND, 'Comment not found');

  appAssert(
    comment.authorId.toString() === authorId.toString(),
    FORBIDDEN,
    'You can edit only your own comments'
  );

  // 2️⃣ Обновляем
  await CommentModel.updateOne({ _id: commentId }, { $set: { content } });

  // 3️⃣ Забираем ОБНОВЛЁННЫЙ комментарий с populate
  const populatedComment = await CommentModel.findById(commentId)
    .populate('authorId', 'username avatarUrl')
    .populate('blogId', 'title')
    .lean<CommentPopulated>();

  appAssert(populatedComment, NOT_FOUND, 'Comment not found');

  // 4️⃣ Приводим к DTO-форме
  return {
    _id: populatedComment._id,
    content: populatedComment.content,

    author: {
      _id: populatedComment.authorId._id,
      username: populatedComment.authorId.username,
      avatarUrl: populatedComment.authorId.avatarUrl ?? null,
    },

    blog: {
      _id: populatedComment.blogId._id,
      title: populatedComment.blogId.title,
    },

    level: populatedComment.level,
    parentCommentId: populatedComment.parentCommentId?.toString() ?? null,
    rootCommentId: populatedComment.rootCommentId?.toString() ?? null,
    replyToUserId: populatedComment.replyToUserId?.toString() ?? null,

    createdAt: populatedComment.createdAt,
    updatedAt: populatedComment.updatedAt,
  };
};

export const getBlogComments = async ({
  blogId,
  page,
  limit,
}: {
  blogId: mongoose.Types.ObjectId;
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;

  // 1️⃣ Корневые комментарии
  const [rootComments, totalItems] = await Promise.all([
    CommentModel.find({
      blogId,
      level: 0,
    })
      .populate('authorId', 'username avatarUrl')
      .populate('blogId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    CommentModel.countDocuments({
      blogId,
      level: 0,
    }),
  ]);

  const rootIds = rootComments.map((c) => c._id);

  // 2️⃣ Ответы
  const replies = await CommentModel.find({
    rootCommentId: { $in: rootIds },
    level: 1,
  })
    .populate('authorId', 'username avatarUrl')
    .populate('blogId', 'title')
    .sort({ createdAt: 1 })
    .lean();

  // 3️⃣ Группируем ответы
  const repliesMap = new Map<string, any[]>();

  replies.forEach((reply) => {
    const key = reply.rootCommentId!.toString();
    if (!repliesMap.has(key)) {
      repliesMap.set(key, []);
    }
    repliesMap.get(key)!.push(reply);
  });

  // 4️⃣ Финальная структура
  const comments = rootComments.map((root) => ({
    ...mapCommentWithAuthorAndBlog(root),
    replies:
      repliesMap.get(root._id.toString())?.map(mapCommentWithAuthorAndBlog) ??
      [],
  }));

  return {
    comments,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const getUserComments = async ({
  authorId,
  page,
  limit,
}: {
  authorId: mongoose.Types.ObjectId;
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;

  const [comments, totalItems] = await Promise.all([
    CommentModel.find({
      authorId,
    })
      .populate('authorId', 'username avatarUrl')
      .populate('blogId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    CommentModel.countDocuments({
      authorId,
    }),
  ]);

  return {
    comments: comments.map(mapCommentWithAuthorAndBlog),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};
