'use client';

import React from 'react';
import Link from 'next/link';
import { IBook } from '@/types';
import { BookOpen } from 'lucide-react';

interface BookCardProps {
  book: IBook;
  size?: 'normal' | 'large' | 'compact';
}

export function BookCard({ book, size = 'normal' }: BookCardProps) {
  const isLarge = size === 'large';
  const isCompact = size === 'compact';

  return (
    <Link
      href={`/books/${book._id}`}
      className="group flex flex-col focus:outline-none transition-all duration-300"
    >
      {/* Cover Image */}
      <div
        className={`relative w-full rounded-xl overflow-hidden bg-[#161e2e] border border-[#1e2638] shadow-md group-hover:border-slate-600 group-hover:-translate-y-1 transition-all ${
          isLarge
            ? 'aspect-[3/4.6] shadow-xl'
            : isCompact
            ? 'aspect-[3/4.2]'
            : 'aspect-[3/4.4]'
        }`}
      >
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-[#131926] to-[#0e131f]">
            <BookOpen className="w-8 h-8 text-slate-600 mb-2" />
            <span className="text-[10px] font-semibold text-slate-400 line-clamp-2">
              {book.title}
            </span>
          </div>
        )}
      </div>

      {/* Title & Author */}
      <div className="mt-2 space-y-0.5">
        <h3
          className={`font-bold text-white tracking-tight truncate group-hover:text-blue-400 transition-colors ${
            isLarge ? 'text-sm' : 'text-xs'
          }`}
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-[11px] text-slate-400 truncate" title={book.author}>
          {book.author}
        </p>
      </div>
    </Link>
  );
}
