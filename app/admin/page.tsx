'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { StatsCards } from '@/components/admin/stats-cards';
import { BookTable } from '@/components/admin/book-table';
import { UploadDropzone } from '@/components/admin/upload-dropzone';
import { StatsResponse, IBook } from '@/types';
import { ShieldAlert, PlusCircle, BarChart3, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'manage' | 'add'>('manage');
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, booksRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/books?limit=100'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (booksRes.ok) {
        const booksData = await booksRes.json();
        setBooks(booksData);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-800/80 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" /> Administrative Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Library Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor real-time student engagement, manage catalog books, and upload new titles
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'manage'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview & Books</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'add'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Loading Administrative Analytics...
          </p>
        </div>
      ) : activeTab === 'manage' ? (
        <div className="space-y-10">
          {/* Analytics KPIs */}
          <StatsCards stats={stats} />

          {/* Book Catalog Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">Catalog Management</h2>
            <BookTable books={books} onRefresh={fetchData} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white tracking-tight">Publish New Title</h2>
            <p className="text-xs text-slate-400">
              Drag-and-drop cover image and PDF document with live visual preview
            </p>
          </div>
          <UploadDropzone
            onSuccess={() => {
              fetchData();
              setActiveTab('manage');
            }}
          />
        </div>
      )}
    </div>
  );
}

