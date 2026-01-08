import { CONFLICT, NOT_FOUND } from '../constants/http.js';
import CommentModel from '../models/comment.model.js';
import mongoose from 'mongoose';
import appAssert from '../utils/appAssert.js';

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
      parentComment.level === 1,
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
