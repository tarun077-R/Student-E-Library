'use client';

import React, { useState, useEffect } from 'react';
import { ReadingActivityChart } from '@/components/dashboard/reading-activity-chart';
import { ShelfCollectionCard } from '@/components/dashboard/shelf-collection-card';
import { IBook } from '@/types';
import { Plus, Flame, TrendingUp, BookCheck, Target, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        const res = await fetch('/api/books?limit=30');
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        }
      } catch (err) {
        console.error('Failed to load books for dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  // Split books across collections for realistic display
  const favorites = books.slice(0, 4);
  const sciFi = books.filter((b) => b.category?.toLowerCase().includes('sci') || b.category?.toLowerCase().includes('fiction')).slice(0, 4);
  const workStudy = books.filter((b) => b.category?.toLowerCase().includes('computer') || b.category?.toLowerCase().includes('math')).slice(0, 4);
  const quickReads = books.slice(4, 8);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-medium">Loading Dashboard Analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Dashboard & Analytics
        </h1>
      </div>

      {/* 4 KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Reading Time */}
        <div className="p-5 rounded-3xl bg-[#131926] border border-[#1e2638] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Reading Time</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">12h 45m</p>
            <p className="text-[11px] text-slate-500 mt-1">This week</p>
          </div>
        </div>

        {/* Card 2: Books Completed */}
        <div className="p-5 rounded-3xl bg-[#131926] border border-[#1e2638] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Books Completed</span>
            <BookCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">8</p>
            <div className="w-full h-1.5 rounded-full bg-[#1e2638] overflow-hidden">
              <div className="w-2/3 h-full bg-blue-500 rounded-full" />
            </div>
            <p className="text-[11px] text-slate-500">Goal: 12</p>
          </div>
        </div>

        {/* Card 3: Daily Streak */}
        <div className="p-5 rounded-3xl bg-[#131926] border border-[#1e2638] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Daily Streak</span>
            <span className="text-base">🔥</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">15</p>
              <span className="text-sm font-semibold text-slate-300">Days</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Personal best this semester</p>
          </div>
        </div>

        {/* Card 4: Progress Annual Reading Challenge */}
        <div className="p-5 rounded-3xl bg-[#131926] border border-[#1e2638] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Progress</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-white">Annual Reading Challenge</p>
            <div className="w-full h-1.5 rounded-full bg-[#1e2638] overflow-hidden">
              <div className="w-[60%] h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>15 of 25 books read</span>
              <span className="text-white font-semibold">60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Activity Chart */}
      <ReadingActivityChart />

      {/* Shelf Management Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-tight">Shelf Management</h2>

          <button
            onClick={() => alert('New custom shelf creation dialog')}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Shelf</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ShelfCollectionCard
            title="Favorites"
            bookCount={12}
            books={favorites.length ? favorites : books.slice(0, 4)}
          />
          <ShelfCollectionCard
            title="Sci-Fi To-Read"
            bookCount={8}
            books={sciFi.length ? sciFi : books.slice(2, 6)}
          />
          <ShelfCollectionCard
            title="Work & Study"
            bookCount={5}
            books={workStudy.length ? workStudy : books.slice(4, 8)}
          />
          <ShelfCollectionCard
            title="Quick Reads"
            bookCount={14}
            books={quickReads.length ? quickReads : books.slice(6, 10)}
          />
        </div>
      </div>
    </div>
  );
}

