'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IShelfItem, IBook, ReadingStatus } from '@/types';
import { ProgressModal } from './progress-modal';
import { BookOpen, CheckCircle2, Bookmark, MoreVertical, Edit3, Trash2, ArrowRight } from 'lucide-react';

interface KanbanBoardProps {
  shelf: IShelfItem[];
  onRefresh: () => void;
}

export function KanbanBoard({ shelf, onRefresh }: KanbanBoardProps) {
  const [selectedItem, setSelectedItem] = useState<IShelfItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const readingItems = shelf.filter((item) => item.status === 'reading');
  const savedItems = shelf.filter((item) => item.status === 'saved');
  const completedItems = shelf.filter((item) => item.status === 'completed');

  const handleStatusChange = async (bookId: string, newStatus: ReadingStatus) => {
    try {
      await fetch('/api/shelf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, status: newStatus }),
      });
      setActiveMenuId(null);
      onRefresh();
    } catch (err) {
      console.error('Error shifting card:', err);
    }
  };

  const handleRemove = async (bookId: string) => {
    try {
      await fetch(`/api/shelf?bookId=${bookId}`, {
        method: 'DELETE',
      });
      setActiveMenuId(null);
      onRefresh();
    } catch (err) {
      console.error('Error removing book:', err);
    }
  };

  const renderColumn = (
    title: string,
    items: IShelfItem[],
    icon: React.ReactNode,
    accentColor: string,
    badgeBg: string
  ) => {
    return (
      <div className="flex flex-col rounded-3xl glass-panel p-4 sm:p-5 border border-slate-800/80 min-h-[450px]">
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${badgeBg}`}>{icon}</div>
            <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white">{title}</h3>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {items.length}
          </span>
        </div>

        {/* Cards Stack */}
        <div className="space-y-3.5 flex-1 overflow-y-auto">
          {items.map((item) => {
            const book = item.book as IBook;
            if (!book || !book._id) return null;

            const percentage = Math.min(
              100,
              Math.round(((item.currentPage || 0) / (item.totalPages || book.totalPages || 1)) * 100)
            );

            const isMenuOpen = activeMenuId === book._id;

            return (
              <div
                key={book._id}
                className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 p-3.5 transition-all shadow-sm hover:shadow-glow-sm"
              >
                <div className="flex gap-3">
                  {/* Book Cover */}
                  <Link
                    href={`/books/${book._id}`}
                    className="w-14 sm:w-16 aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 shrink-0 block relative"
                  >
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs">📖</div>
                    )}
                  </Link>

                  {/* Info & Progress */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link href={`/books/${book._id}`}>
                          <h4 className="text-xs font-bold text-white truncate hover:text-indigo-300 transition-colors">
                            {book.title}
                          </h4>
                        </Link>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(isMenuOpen ? null : book._id)}
                            className="text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-800 transition-colors"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl p-1 z-30 space-y-1">
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-slate-900"
                              >
                                <Edit3 className="w-3 h-3 text-indigo-400" />
                                <span>Edit Progress</span>
                              </button>

                              {item.status !== 'reading' && (
                                <button
                                  onClick={() => handleStatusChange(book._id, 'reading')}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-slate-900"
                                >
                                  <BookOpen className="w-3 h-3 text-amber-400" />
                                  <span>Move to Reading</span>
                                </button>
                              )}

                              {item.status !== 'completed' && (
                                <button
                                  onClick={() => handleStatusChange(book._id, 'completed')}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-slate-900"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>Mark Completed</span>
                                </button>
                              )}

                              {item.status !== 'saved' && (
                                <button
                                  onClick={() => handleStatusChange(book._id, 'saved')}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-slate-300 hover:bg-slate-900"
                                >
                                  <Bookmark className="w-3 h-3 text-cyan-400" />
                                  <span>Move to Saved</span>
                                </button>
                              )}

                              <div className="pt-1 border-t border-slate-800">
                                <button
                                  onClick={() => handleRemove(book._id)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-rose-400 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                    </div>

                    {/* Progress Bar & Details */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">
                          p. {item.currentPage || 0} / {item.totalPages || book.totalPages || 1}
                        </span>
                        <span className="font-bold text-slate-300">{percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${accentColor} rounded-full transition-all duration-300`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Row */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Update Progress
                  </button>

                  <Link
                    href={`/books/${book._id}/read`}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-white hover:text-indigo-300"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="h-40 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800/80 rounded-2xl text-slate-500">
              <p className="text-xs">No books in this section</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderColumn(
          'Currently Reading',
          readingItems,
          <BookOpen className="w-4 h-4 text-amber-400" />,
          'bg-gradient-to-r from-amber-500 to-indigo-500',
          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
        )}

        {renderColumn(
          'Want to Read (Saved)',
          savedItems,
          <Bookmark className="w-4 h-4 text-cyan-400" />,
          'bg-gradient-to-r from-cyan-500 to-blue-500',
          'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
        )}

        {renderColumn(
          'Completed',
          completedItems,
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          'bg-gradient-to-r from-emerald-500 to-teal-400',
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
        )}
      </div>

      {selectedItem && (
        <ProgressModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
}

