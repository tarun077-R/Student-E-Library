export type ReadingStatus = 'reading' | 'saved' | 'completed';

export interface IShelfItem {
  book: IBook | string;
  status: ReadingStatus;
  currentPage: number;
  totalPages: number;
  lastReadAt: string | Date;
}

export interface IBook {
  _id: string;
  title: string;
  author: string;
  description?: string;
  category: string;
  fileUrl: string;
  coverImage?: string;
  totalPages?: number;
  uploadedBy?: {
    _id: string;
    name: string;
    email: string;
  } | string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  shelf: IShelfItem[];
  savedBooks?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

export interface StatsResponse {
  totalBooks: number;
  totalStudents: number;
  activeReaders: number;
  totalShelved: number;
  categoryStats: { name: string; count: number }[];
}

