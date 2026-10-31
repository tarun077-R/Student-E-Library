'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Bookmark, Check, ChevronDown, BookOpen, CheckCircle2, Trash2, Loader2 } from 'lucide-react';
import { ReadingStatus } from '@/types';

interface ShelfActionButtonProps {
  bookId: string;
  initialStatus?: ReadingStatus | null;
}

export function ShelfActionButton({ bookId, initialStatus = null }: ShelfActionButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<ReadingStatus | null>(initialStatus);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (newStatus: ReadingStatus | 'remove') => {
    if (!user) {
      router.push(`/login?redirect=/books/${bookId}`);
      return;
    }

    try {
      setLoading(true);
      setDropdownOpen(false);

      if (newStatus === 'remove') {
        const res = await fetch(`/api/shelf?bookId=${bookId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setStatus(null);
        }
      } else {
        const res = await fetch('/api/shelf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookId, status: newStatus }),
        });
        if (res.ok) {
          setStatus(newStatus);
        }
      }
    } catch (err) {
      console.error('Error updating shelf status:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = () => {
    if (!status) return 'Add to Shelf';
    if (status === 'reading') return 'Currently Reading';
    if (status === 'completed') return 'Completed';
    return 'Saved to Shelf';
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center rounded-xl glass-panel border border-slate-700/80 overflow-hidden shadow-sm">
        <button
          onClick={() => handleUpdateStatus(status ? (status === 'reading' ? 'saved' : 'reading') : 'saved')}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold transition-all ${
            status
              ? 'bg-indigo-600/20 text-indigo-300 border-r border-indigo-500/30'
              : 'text-slate-200 hover:text-white hover:bg-slate-800/60 border-r border-slate-800'
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : status ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Bookmark className="w-4 h-4 text-indigo-400" />
          )}
          <span>{getStatusLabel()}</span>
        </button>

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={loading}
          className="p-3.5 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="More options"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-slate-800 bg-slate-950/95 backdrop-blur-2xl shadow-xl z-30 p-1.5 space-y-1">
          <button
            onClick={() => handleUpdateStatus('saved')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${
              status === 'saved' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <span>Want to Read (Saved)</span>
          </button>

          <button
            onClick={() => handleUpdateStatus('reading')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${
              status === 'reading' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Currently Reading</span>
          </button>

          <button
            onClick={() => handleUpdateStatus('completed')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-left transition-colors ${
              status === 'completed' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Completed</span>
          </button>

          {status && (
            <div className="pt-1 border-t border-slate-800/80">
              <button
                onClick={() => handleUpdateStatus('remove')}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-left text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove from Shelf</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
