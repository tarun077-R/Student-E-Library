'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IBook } from '@/types';
import { ReaderToolbar, ReaderTheme } from './toolbar';
import { OutlineSidebar } from './outline-sidebar';
import { Loader2 } from 'lucide-react';

interface PDFReaderViewerProps {
  book: IBook;
  initialPage?: number;
}

export function PDFReaderViewer({ book, initialPage = 1 }: PDFReaderViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(book.totalPages || 45);
  const [zoom, setZoom] = useState(100);
  const [theme, setTheme] = useState<ReaderTheme>('dark');
  const [showUI, setShowUI] = useState(true);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide UI controls after 3 seconds of inactivity
  const resetHideTimer = useCallback(() => {
    setShowUI(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setShowUI(false);
    }, 3500);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // Debounced auto-save reading progress to MongoDB
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await fetch('/api/shelf/progress', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId: book._id,
            currentPage,
            totalPages,
          }),
        });
      } catch (err) {
        console.error('Failed to auto-save reading progress:', err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [book._id, currentPage, totalPages]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetHideTimer();
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((p) => Math.max(1, p - 1));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, isFullscreen, resetHideTimer]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const getThemeBackground = () => {
    if (theme === 'sepia') return '#f5e6c8';
    if (theme === 'paper') return '#f4f0e8';
    return '#070b14'; // Slate dark
  };

  const getThemeFilter = () => {
    if (theme === 'dark') {
      return 'invert(0.9) hue-rotate(180deg) brightness(0.9) contrast(1.15)';
    }
    if (theme === 'sepia') {
      return 'sepia(0.5) contrast(0.95) brightness(0.98)';
    }
    return 'contrast(1.02)';
  };

  // PDF proxy streaming URL with page parameter
  const pdfStreamUrl = `/api/books/${book._id}/pdf#page=${currentPage}&toolbar=0&navpanes=0`;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
      className="relative w-screen h-screen overflow-hidden flex flex-col transition-colors duration-500"
      style={{ backgroundColor: getThemeBackground() }}
    >
      {/* Top and Bottom Toolbars */}
      <ReaderToolbar
        book={book}
        showUI={showUI}
        theme={theme}
        setTheme={setTheme}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        zoom={zoom}
        setZoom={setZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onToggleOutline={() => setOutlineOpen(!outlineOpen)}
      />

      {/* Chapters & Outline Sidebar */}
      <OutlineSidebar
        isOpen={outlineOpen}
        onClose={() => setOutlineOpen(false)}
        book={book}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageSelect={setCurrentPage}
      />

      {/* Main Reader Viewport */}
      <main className="flex-1 w-full h-full pt-14 pb-16 flex items-center justify-center overflow-auto p-2 sm:p-4">
        <div
          className="relative w-full max-w-4xl h-full rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md z-20 text-white gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <p className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                Opening Document Stream...
              </p>
            </div>
          )}

          <iframe
            src={pdfStreamUrl}
            title={book.title}
            onLoad={() => setLoading(false)}
            className="w-full h-full border-0 rounded-2xl transition-all duration-500"
            style={{
              filter: getThemeFilter(),
            }}
          />
        </div>
      </main>
    </div>
  );
}
