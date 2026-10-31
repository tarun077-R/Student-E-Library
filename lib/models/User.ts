import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShelfSubdocument {
  book: mongoose.Types.ObjectId;
  status: 'reading' | 'saved' | 'completed';
  currentPage: number;
  totalPages: number;
  lastReadAt: Date;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  shelf: IShelfSubdocument[];
  savedBooks?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ShelfItemSchema = new Schema<IShelfSubdocument>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    status: {
      type: String,
      enum: ['reading', 'saved', 'completed'],
      default: 'saved',
    },
    currentPage: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPages: {
      type: Number,
      default: 1,
      min: 1,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    shelf: {
      type: [ShelfItemSchema],
      default: [],
    },
    savedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Backward compatibility: If shelf is empty but savedBooks has elements, migrate on retrieval
UserSchema.methods.ensureShelfPopulated = function () {
  if ((!this.shelf || this.shelf.length === 0) && this.savedBooks && this.savedBooks.length > 0) {
    this.shelf = this.savedBooks.map((bookId: mongoose.Types.ObjectId) => ({
      book: bookId,
      status: 'saved',
      currentPage: 0,
      totalPages: 1,
      lastReadAt: new Date(),
    }));
  }
};

export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
