import { CREATED } from '../constants/http.js';
import { Request, Response } from 'express';
import { createComment } from '../services/comment.service.js';
import { commentSchema } from './comment.schema.js';
import mongoose from 'mongoose';

export const createCommentController = async (req: Request, res: Response) => {
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
};
