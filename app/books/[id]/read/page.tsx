import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';
import { User } from '@/lib/models/User';
import { verifyToken } from '@/lib/auth';
import { PDFReaderViewer } from '@/components/pdf-reader/viewer';
import { IBook } from '@/types';

interface ReaderPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ReaderPageProps): Promise<Metadata> {
  await connectToDatabase();
  const book = await Book.findById(params.id).select('title author').lean();
  if (!book) return { title: 'Reader | Student E-Library' };
  return {
    title: `Reading: ${book.title} - ${book.author} | Student E-Library`,
  };
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  await connectToDatabase();
  const bookDoc = await Book.findById(params.id).lean();

  if (!bookDoc) {
    notFound();
  }

  const book: IBook = JSON.parse(JSON.stringify(bookDoc));

  // Determine user's last saved reading page if logged in
  let initialPage = 1;
  const token = cookies().get('token')?.value;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      const user = await User.findById(payload.id).select('shelf').lean();
      if (user && user.shelf) {
        const item = user.shelf.find(
          (s: any) => s.book.toString() === params.id.toString()
        );
        if (item && item.currentPage > 0) {
          initialPage = item.currentPage;
        }
      }
    }
  }

  return <PDFReaderViewer book={book} initialPage={initialPage} />;
}

