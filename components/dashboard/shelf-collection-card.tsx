'use client';

import React from 'react';
import Link from 'next/link';
import { IBook } from '@/types';
import { MoreHorizontal } from 'lucide-react';

interface ShelfCollectionCardProps {
  title: string;
  bookCount: number;
  books: IBook[];
  href?: string;
}

export function ShelfCollectionCard({
  title,
  bookCount,
  books,
  href = '/shelf',
}: ShelfCollectionCardProps) {
  const displayBooks = books.slice(0, 4);

  return (
    <Link
      href={href}
      className="group block p-4 rounded-2xl bg-[#131926] border border-[#1e2638] hover:border-slate-600 transition-all shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">{bookCount} books</p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="text-slate-500 hover:text-white p-1 rounded-lg"
          aria-label="Collection options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Overlapping mini book covers stack */}
      <div className="flex items-center gap-1.5 pt-1">
        {displayBooks.map((b, i) => (
          <div
            key={b._id || i}
            className="flex-1 aspect-[3/4.4] rounded-lg overflow-hidden bg-[#1a2336] border border-[#1e2638] shadow-sm relative group-hover:-translate-y-0.5 transition-transform"
          >
            {b.coverImage ? (
              <img
                src={b.coverImage}
                alt={b.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px]">📖</div>
            )}
          </div>
        ))}

        {/* Fill remaining slots if fewer than 4 books */}
        {Array.from({ length: Math.max(0, 4 - displayBooks.length) }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex-1 aspect-[3/4.4] rounded-lg bg-[#161e2e]/50 border border-[#1e2638] border-dashed"
          />
        ))}
      </div>
    </Link>
  );
}

