'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Computer Science',
  'Fiction',
  'Novel',
  'Science Fiction',
  'Non-fiction',
  'Mystery',
  'Mathematics',
  'Physics',
  'Web',
  'Other',
];

export function BookFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';
  const currentSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Sync internal search state when URL changes externally
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const updateFilters = (newCategory: string, newSearch: string) => {
    const params = new URLSearchParams();

    if (newCategory && newCategory !== 'All') {
      params.set('category', newCategory);
    }

    if (newSearch && newSearch.trim()) {
      params.set('search', newSearch.trim());
    }

    const query = params.toString();
    router.push(`/books${query ? `?${query}` : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(currentCategory, searchTerm);
  };

  const handleCategorySelect = (cat: string) => {
    updateFilters(cat, searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    router.push('/books');
  };

  const hasActiveFilters = (currentCategory && currentCategory !== 'All') || !!currentSearch;

  return (
    <div className="w-full space-y-4 mb-8">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-2xl mx-auto">
        <div className="absolute left-4 pointer-events-none text-slate-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by title, author, or keyword..."
          className="w-full pl-12 pr-24 py-3.5 rounded-2xl glass-panel text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                updateFilters(currentCategory, '');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-sm transition-all"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full justify-start md:justify-center">
        {CATEGORIES.map((cat) => {
          const isSelected = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-glow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
