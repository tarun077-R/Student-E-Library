'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookCard } from '@/components/book-card';
import { IBook, IShelfItem } from '@/types';
import { BookOpen, Loader2, ArrowRight } from 'lucide-react';

export default function MyLibraryPage() {
  const [shelf, setShelf] = useState<IShelfItem[]>([]);
  const [allBooks, setAllBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [shelfRes, booksRes] = await Promise.all([
          fetch('/api/shelf'),
          fetch('/api/books?limit=40'),
        ]);

        if (shelfRes.ok) {
          const shelfData = await shelfRes.json();
          setShelf(shelfData);
        }

        if (booksRes.ok) {
          const booksData = await booksRes.json();
          setAllBooks(booksData);
        }
      } catch (err) {
        console.error('Failed to load library data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter shelf for currently reading or fallback to first book in library
  const readingShelfItems = shelf
    .filter((s) => s.status === 'reading')
    .map((s) => s.book as IBook)
    .filter(Boolean);

  const currentlyReadingBook: IBook | undefined =
    readingShelfItems[0] || allBooks[0];

  const continueReadingBooks: IBook[] =
    readingShelfItems.length > 1
      ? readingShelfItems.slice(1)
      : allBooks.slice(1, 7);

  const recentlyAddedBooks: IBook[] = allBooks.slice(0, 16);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-medium tracking-wide">Loading Library...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-10 max-w-[1600px] mx-auto w-full">
      {/* Top Section: Currently Reading + Continue Reading */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
        {/* Left: Currently Reading Spotlight */}
        <div>
          <h2 className="text-sm font-bold text-slate-200 tracking-tight mb-4">
            Currently Reading
          </h2>

          {currentlyReadingBook ? (
            <div className="w-[190px]">
              <BookCard book={currentlyReadingBook} size="large" />
            </div>
          ) : (
            <div className="w-[190px] aspect-[3/4.5] rounded-xl bg-[#131926] border border-[#1e2638] flex items-center justify-center text-slate-600 text-xs">
              No book reading yet
            </div>
          )}
        </div>

        {/* Right: Continue Reading Shelf Carousel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200 tracking-tight">
              Continue Reading
            </h2>
            <Link
              href="/books"
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {continueReadingBooks.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recently Added Grid */}
      <div className="space-y-4 pt-4 border-t border-[#1e2638]/70">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 tracking-tight">
            Recently Added
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {recentlyAddedBooks.length} books in catalog
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-5">
          {recentlyAddedBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </div>
  );
}
