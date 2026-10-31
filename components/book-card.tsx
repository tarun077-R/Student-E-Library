'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { IBook } from '@/types';
import { Bookmark, Check, Star, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: IBook;
  isInitiallySaved?: boolean;
}

export function BookCard({ book, isInitiallySaved = false }: BookCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [saving, setSaving] = useState(false);

  const handleShelfToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push(`/login?redirect=/books`);
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/shelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book._id, action: 'toggle' }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsSaved(data.isSaved);
      }
    } catch (err) {
      console.error('Error toggling shelf:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl glass-panel overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow-md">
      {/* Cover Image Container */}
      <Link href={`/books/${book._id}`} className="block relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/60 p-4 text-center">
            <BookOpen className="w-10 h-10 text-indigo-400/60 mb-2" />
            <span className="text-xs font-semibold text-slate-400 line-clamp-2">
              {book.title}
            </span>
          </div>
        )}

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Pill Overlay */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md bg-slate-950/80 border border-slate-700/80 text-indigo-300 shadow-sm">
            {book.category}
          </span>
        </div>

        {/* Quick Shelf Button */}
        <button
          onClick={handleShelfToggle}
          disabled={saving}
          aria-label={isSaved ? 'Remove from shelf' : 'Add to shelf'}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-xl backdrop-blur-md flex items-center justify-center transition-all ${
            isSaved
              ? 'bg-emerald-500/90 text-white shadow-glow-emerald border border-emerald-400'
              : 'bg-slate-950/70 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-400 hover:bg-slate-900'
          }`}
          title={isSaved ? 'Saved to Shelf (Click to remove)' : 'Add to Shelf'}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </Link>

      {/* Book Metadata Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          <Link href={`/books/${book._id}`}>
            <h3
              className="text-xs sm:text-sm font-bold tracking-tight text-white line-clamp-1 group-hover:text-indigo-300 transition-colors"
              title={book.title}
            >
              {book.title}
            </h3>
          </Link>
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5" title={book.author}>
            {book.author}
          </p>
        </div>

        {/* Rating & Actions Row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 mt-1">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>

          <Link
            href={`/books/${book._id}/read`}
            className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            Read <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

