import mongoose from 'mongoose';

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogDocument extends mongoose.Document {
  authorId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  excerpt?: string;
  status: BlogStatus;

  createdAt: Date;
  updatedAt: Date;
  lastEditedAt?: Date | null;
  publishedAt?: Date;

  categories: string[];

  coverImgUrl: string | null;
  imagesUrls: string[];
}

const blogSchema = new mongoose.Schema<BlogDocument>(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
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
    lastEditedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.virtual('excerpt').get(function () {
  return this.content.slice(0, 200);
});

const BlogModel = mongoose.model<BlogDocument>('Blog', blogSchema);
export default BlogModel;
