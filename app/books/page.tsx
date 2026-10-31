import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';
import { BookCard } from '@/components/book-card';
import { BookFilters } from '@/components/book-filters';
import { IBook } from '@/types';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Browse Catalog | Library',
  description:
    'Browse our comprehensive catalog of student textbooks, computer science guides, fiction, and research publications.',
};

export const dynamic = 'force-dynamic';

interface BooksPageProps {
  searchParams: {
    category?: string;
    search?: string;
  };
}

async function getBooks(category?: string, search?: string): Promise<IBook[]> {
  try {
    await connectToDatabase();
    const query: Record<string, any> = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ title: regex }, { author: regex }, { description: regex }];
    }

    const books = await Book.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(books));
  } catch (error) {
    console.error('Failed to fetch books in catalog:', error);
    return [];
  }
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const category = searchParams.category || 'All';
  const search = searchParams.search || '';

  const books = await getBooks(category, search);

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Header and Filter Pills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1e2638]">
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Browse Catalog
          </h1>
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{books.length}</strong> titles
          </span>
        </div>

        <BookFilters />
      </div>

      {/* Book Grid (Matching Screenshot 1 & 3 density) */}
      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-5">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center p-8 rounded-2xl bg-[#131926] border border-[#1e2638]">
          <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No books found</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Try adjusting your search query or selecting a different genre above.
          </p>
        </div>
      )}
    </div>
  );
}
