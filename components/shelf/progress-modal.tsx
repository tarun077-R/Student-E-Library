'use client';

import React, { useState } from 'react';
import { X, Check, BookOpen, Loader2 } from 'lucide-react';
import { IShelfItem, IBook, ReadingStatus } from '@/types';

interface ProgressModalProps {
  item: IShelfItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProgressModal({ item, isOpen, onClose, onSuccess }: ProgressModalProps) {
  const book = item.book as IBook;
  const [currentPage, setCurrentPage] = useState(item.currentPage || 0);
  const [totalPages, setTotalPages] = useState(item.totalPages || book.totalPages || 100);
  const [status, setStatus] = useState<ReadingStatus>(item.status);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const percentage = Math.min(100, Math.round(((currentPage || 0) / (totalPages || 1)) * 100));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/shelf/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book._id,
          currentPage,
          totalPages,
          status,
        }),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Update Reading Progress</h3>
            <p className="text-xs text-slate-400 truncate max-w-[240px]">{book.title}</p>
          </div>
        </div>

        {/* Progress Preview Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Completion</span>
            <span className="text-indigo-400">{percentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Current Page</label>
              <input
                type="number"
                min={0}
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Total Pages</label>
              <input
                type="number"
                min={1}
                value={totalPages}
                onChange={(e) => setTotalPages(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick Page Jumps */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 5))}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white"
            >
              +5 Pages
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 20))}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white"
            >
              +20 Pages
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentPage(totalPages);
                setStatus('completed');
              }}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 hover:text-emerald-300 ml-auto"
            >
              Mark Finished
            </button>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-xs font-semibold text-slate-300">Shelf Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['saved', 'reading', 'completed'] as ReadingStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl capitalize transition-all border ${
                    status === st
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {st === 'saved' ? 'Saved' : st === 'reading' ? 'Reading' : 'Done'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-wider shadow-glow-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Save Progress</span>
          </button>
        </form>
      </div>
    </div>
  );
}
