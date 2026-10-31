import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';
import { BookCard } from '@/components/book-card';
import { BookFilters } from '@/components/book-filters';
import { IBook } from '@/types';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catalog | Browse All Books',
  description:
    'Browse our comprehensive catalog of student textbooks, computer science guides, fiction, and research publications.',
};

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Library <span className="text-gradient">Catalog</span>
        </h1>
        <p className="text-sm text-slate-400">
          Search and explore books across all disciplines. Click on any title to read or add to your personal shelf.
        </p>
      </div>

      {/* Real-time Search and Category Quick Pills */}
      <BookFilters />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/80 text-xs text-slate-400">
        <div>
          Showing <span className="font-bold text-white">{books.length}</span>{' '}
          {books.length === 1 ? 'book' : 'books'}
          {category !== 'All' && (
            <span>
              {' '}
              in <span className="text-indigo-400 font-semibold">{category}</span>
            </span>
          )}
          {search && (
            <span>
              {' '}
              matching &quot;<span className="text-white font-semibold">{search}</span>&quot;
            </span>
          )}
        </div>
      </div>

      {/* Book Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center glass-panel rounded-2xl border border-slate-800/80 p-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No books matched your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            We couldn&apos;t find any books matching your search or category filter. Try clearing filters or searching for another keyword.
          </p>
        </div>
      )}
    </div>
  );
}
