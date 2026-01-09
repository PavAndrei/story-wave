import { CREATED, NOT_FOUND, OK } from '../constants/http.js';
import { Request, Response } from 'express';
import {
  createComment,
  deleteComment,
  editComment,
} from '../services/comment.service.js';
import { commentSchema, editCommentSchema } from './comment.schema.js';
import mongoose from 'mongoose';
import catchErrors from '../utils/catchErrors.js';
import appAssert from '../utils/appAssert.js';

export const createCommentHandler = catchErrors(async (req, res) => {
  const authorId = req.userId!;

  const request = commentSchema.parse(req.body);

  const comment = await createComment({
    authorId,
    content: request.content,
    blogId: new mongoose.Types.ObjectId(request.blogId),
    parentCommentId: request.parentCommentId,
    replyToUserId: request.replyToUserId
      ? new mongoose.Types.ObjectId(request.replyToUserId)
      : undefined,
  });

  return res.status(CREATED).json({
    success: true,
    message: 'Comment created successfully',
    comment,
  });
});

export const deleteCommentHandler = catchErrors(async (req, res) => {
  const authorId = req.userId!;

  const commentId = req.params.id;
  console.log(commentId);
  appAssert(
    mongoose.Types.ObjectId.isValid(commentId),
    NOT_FOUND,
    'Invalid comment id'
  );
  await deleteComment({
    commentId: new mongoose.Types.ObjectId(commentId),
    authorId,
  });

  return res.status(OK).json({
    success: true,
    message: 'Comment deleted successfully',
  });
});

export const editCommentHandler = catchErrors(async (req, res) => {
  const authorId = req.userId!;
  const commentId = req.params.id;
  appAssert(
    mongoose.Types.ObjectId.isValid(commentId),
    NOT_FOUND,
    'Invalid comment id'
  );
  const { content } = editCommentSchema.parse(req.body);

  const updatedComment = await editComment({
    commentId: new mongoose.Types.ObjectId(commentId),
    authorId,
    content,
  });

  return res.status(OK).json({
    success: true,
    message: 'Comment updated successfully',
    comment: updatedComment,
  });
});
