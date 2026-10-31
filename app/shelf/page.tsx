'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { KanbanBoard } from '@/components/shelf/kanban-board';
import { IShelfItem } from '@/types';
import { Bookmark, BookOpen, CheckCircle2, LayoutGrid, Kanban, Loader2 } from 'lucide-react';

export default function ShelfPage() {
  const { user } = useAuth();
  const [shelf, setShelf] = useState<IShelfItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'tabs'>('kanban');
  const [activeTab, setActiveTab] = useState<'reading' | 'saved' | 'completed'>('reading');

  const fetchShelf = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/shelf');
      if (res.ok) {
        const data = await res.json();
        setShelf(data);
      }
    } catch (err) {
      console.error('Failed to load shelf:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShelf();
  }, [fetchShelf]);

  const readingCount = shelf.filter((s) => s.status === 'reading').length;
  const savedCount = shelf.filter((s) => s.status === 'saved').length;
  const completedCount = shelf.filter((s) => s.status === 'completed').length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Shelf Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-slate-800/80 gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" /> Personal Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {user?.name ? `${user.name}&apos;s Reading Shelf` : 'My Reading Shelf'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track reading sessions, organize active titles, and celebrate completed books
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>

          <button
            onClick={() => setViewMode('tabs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              viewMode === 'tabs'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tabbed</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 my-8">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Currently Reading</p>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1">{readingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Want to Read</p>
            <p className="text-xl sm:text-2xl font-black text-cyan-400 mt-1">{savedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Bookmark className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Completed</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Loading Your Shelf...
          </p>
        </div>
      ) : shelf.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center glass-panel rounded-3xl border border-slate-800 p-8 sm:p-12">
          <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-glow-sm">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Your shelf is completely empty</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
            Explore our curated catalog to discover textbooks, academic papers, and fiction to add to your shelf.
          </p>
          <Link
            href="/books"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-wider shadow-glow-sm transition-all"
          >
            Explore Catalog
          </Link>
        </div>
      ) : viewMode === 'kanban' ? (
        <KanbanBoard shelf={shelf} onRefresh={fetchShelf} />
      ) : (
        /* Tabbed View */
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            {[
              { id: 'reading', label: 'Currently Reading', count: readingCount },
              { id: 'saved', label: 'Want to Read', count: savedCount },
              { id: 'completed', label: 'Completed', count: completedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <KanbanBoard
            shelf={shelf.filter((s) => s.status === activeTab)}
            onRefresh={fetchShelf}
          />
        </div>
      )}
    </div>
  );
}
