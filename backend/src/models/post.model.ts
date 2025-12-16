import mongoose from 'mongoose';

export type PostStatus = 'draft' | 'published' | 'archived';

export interface PostDocument extends mongoose.Document {
  authorId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  excerpt?: string;
  status: PostStatus;

  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  categories: string[];

  coverImgUrl: string;
  imagesUrls: string[];

  isDeleted: boolean;
}

const postSchema = new mongoose.Schema<PostDocument>(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    publishedAt: {
      type: Date,
    },
    categories: {
      type: [String],
      required: true,
      default: [],
    },
    coverImgUrl: { type: String, default: '' },
    imagesUrls: { type: [String], default: [] },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.virtual('excerpt').get(function () {
  return this.content.slice(0, 200);
});

const PostModel = mongoose.model<PostDocument>('Post', postSchema);
export default PostModel;
