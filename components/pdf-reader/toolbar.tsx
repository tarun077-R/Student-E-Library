'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  List,
  Palette,
} from 'lucide-react';
import { IBook } from '@/types';

export type ReaderTheme = 'dark' | 'sepia' | 'paper';

interface ReaderToolbarProps {
  book: IBook;
  showUI: boolean;
  theme: ReaderTheme;
  setTheme: (t: ReaderTheme) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  zoom: number;
  setZoom: (z: number | ((prev: number) => number)) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onToggleOutline: () => void;
}

export function ReaderToolbar({
  book,
  showUI,
  theme,
  setTheme,
  currentPage,
  totalPages,
  onPageChange,
  zoom,
  setZoom,
  isFullscreen,
  onToggleFullscreen,
  onToggleOutline,
}: ReaderToolbarProps) {
  const themesConfig: Record<ReaderTheme, { label: string; bg: string; text: string }> = {
    dark: { label: 'Slate Dark', bg: '#070b14', text: '#f1f5f9' },
    sepia: { label: 'Sepia Warm', bg: '#f5e6c8', text: '#3c2a1a' },
    paper: { label: 'Paper Light', bg: '#f4f0e8', text: '#1a1a1a' },
  };

  return (
    <>
      {/* Top Bar */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-4 sm:px-6 h-14 flex items-center justify-between text-white ${
          showUI ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Left: Exit reader */}
        <Link
          href={`/books/${book._id}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/60"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Exit Reader</span>
        </Link>

        {/* Center: Title & Author */}
        <div className="text-center max-w-sm sm:max-w-md truncate px-2">
          <h1 className="text-xs sm:text-sm font-bold text-white truncate">{book.title}</h1>
          <p className="text-[10px] text-slate-400 truncate">{book.author}</p>
        </div>

        {/* Right: Theme Switcher & Outline Toggle */}
        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 gap-1">
            {(Object.keys(themesConfig) as ReaderTheme[]).map((tKey) => {
              const active = theme === tKey;
              return (
                <button
                  key={tKey}
                  onClick={() => setTheme(tKey)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                  title={themesConfig[tKey].label}
                >
                  {tKey === 'dark' ? '🌙 Dark' : tKey === 'sepia' ? '🍂 Sepia' : '📄 Paper'}
                </button>
              );
            })}
          </div>

          {/* Outline Sidebar Button */}
          <button
            onClick={onToggleOutline}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors border border-slate-800"
            title="Chapters and Outline"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Floating Bottom Navigation Dock */}
      <footer
        className={`fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 transition-all duration-300 ${
          showUI ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-4 px-4 py-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-slate-800/90 shadow-2xl text-white">
          {/* Page Step Previous */}
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page indicator input */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span>Page</span>
            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  onPageChange(Math.min(Math.max(1, val), totalPages || 1));
                }
              }}
              className="w-12 text-center py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-bold"
            />
            <span className="text-slate-400">of {totalPages || 1}</span>
          </div>

          {/* Page Step Next */}
          <button
            onClick={() => onPageChange(Math.min(totalPages || 1, currentPage + 1))}
            disabled={currentPage >= (totalPages || 1)}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-800 hidden sm:block" />

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setZoom((prev) => Math.max(50, prev - 15))}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-300 w-12 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((prev) => Math.min(200, prev + 15))}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <div className="w-[1px] h-4 bg-slate-800 hidden sm:block" />

          {/* Fullscreen button */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </>
  );
}

