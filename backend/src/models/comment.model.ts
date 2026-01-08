import mongoose from 'mongoose';

export type CommentLevel = 0 | 1;

export interface CommentDocument extends mongoose.Document {
  blogId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;

  content: string;

  level: CommentLevel;

  parentCommentId?: mongoose.Types.ObjectId | null;
  rootCommentId?: mongoose.Types.ObjectId | null;

  replyToUserId?: mongoose.Types.ObjectId | null;

  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<CommentDocument>(
  {
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
      index: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    level: {
      type: Number,
      enum: [0, 1],
      required: true,
    },

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },

    rootCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true,
    },

    replyToUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model<CommentDocument>('Comment', commentSchema);

export default CommentModel;
