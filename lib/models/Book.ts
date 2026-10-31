import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookDocument extends Document {
  title: string;
  author: string;
  description?: string;
  category: string;
  fileUrl: string;
  coverImage?: string;
  totalPages?: number;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBookDocument>(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Book file (PDF) is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    totalPages: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error upon hot reload in Next.js development
export const Book: Model<IBookDocument> =
  mongoose.models.Book || mongoose.model<IBookDocument>('Book', BookSchema);

export default Book;
