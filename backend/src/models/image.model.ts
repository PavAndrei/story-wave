import mongoose from 'mongoose';

export interface ImageDocument extends mongoose.Document {
  postId: mongoose.Types.ObjectId;
  url: string;
  publicId: string;
  createdAt: Date;
}

const imageSchema = new mongoose.Schema<ImageDocument>(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ImageDocument>('Image', imageSchema);
