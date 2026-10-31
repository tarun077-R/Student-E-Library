'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Fiction',
  'Novel',
  'Science Fiction',
  'Non-fiction',
  'Mystery',
  'Computer Science',
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
    <div className="w-full space-y-3">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by keyword, title, author..."
          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#131926] border border-[#1e2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              updateFilters(currentCategory, '');
            }}
            className="absolute right-3 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = currentCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 font-semibold shadow-sm'
                  : 'bg-[#131926] text-slate-400 hover:text-slate-200 border-[#1e2638] hover:border-slate-700'
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
