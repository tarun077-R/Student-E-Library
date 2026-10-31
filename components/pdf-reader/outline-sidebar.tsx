'use client';

import React from 'react';
import { X, BookOpen, Layers, Bookmark } from 'lucide-react';
import { IBook } from '@/types';

interface OutlineSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  book: IBook;
  currentPage: number;
  totalPages: number;
  onPageSelect: (page: number) => void;
}

export function OutlineSidebar({
  isOpen,
  onClose,
  book,
  currentPage,
  totalPages,
  onPageSelect,
}: OutlineSidebarProps) {
  if (!isOpen) return null;

  // Generate sample virtual chapters/milestones based on total pages
  const milestoneCount = Math.max(5, Math.min(10, Math.ceil(totalPages / 15)));
  const pagesPerMilestone = Math.max(1, Math.floor(totalPages / milestoneCount));

  const chapters = Array.from({ length: milestoneCount }, (_, i) => {
    const startPage = i * pagesPerMilestone + 1;
    const endPage = i === milestoneCount - 1 ? totalPages : (i + 1) * pagesPerMilestone;
    return {
      title: i === 0 ? 'Introduction & Overview' : `Chapter ${i}: Section ${(i * 1.5).toFixed(1)}`,
      page: startPage,
      pageRange: `${startPage} - ${endPage}`,
    };
  });

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800 p-6 flex flex-col shadow-2xl animate-fade-in text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold tracking-tight text-white">Contents & Sections</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close outline"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Book mini card */}
      <div className="my-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
        <div className="w-10 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs">📖</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{book.title}</p>
          <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
          <p className="text-[10px] text-indigo-400 mt-1 font-semibold">
            Current: Page {currentPage} of {totalPages}
          </p>
        </div>
      </div>

      {/* Chapters list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Sections & Milestones
        </p>

        {chapters.map((ch, idx) => {
          const isActive = currentPage >= ch.page && (idx === chapters.length - 1 || currentPage < chapters[idx + 1].page);

          return (
            <button
              key={ch.title}
              onClick={() => {
                onPageSelect(ch.page);
                onClose();
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <BookOpen className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="truncate">{ch.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 ml-2">p. {ch.pageRange}</span>
            </button>
          );
        })}
      </div>

      {/* Progress Footer */}
      <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
          Progress: {Math.round((currentPage / (totalPages || 1)) * 100)}%
        </span>
        <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Auto-saved
        </span>
      </div>
    </div>
  );
}

