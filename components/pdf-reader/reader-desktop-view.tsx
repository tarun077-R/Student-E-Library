'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IBook } from '@/types';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  BookOpen,
  Send,
  Plus,
  BookMarked,
  LayoutTemplate,
  FileText,
} from 'lucide-react';

interface NoteItem {
  id: string;
  type: string;
  tag: string;
  tagColor: string;
  annotationLabel?: string;
  text: string;
  highlightWords?: string[];
}

interface ReaderDesktopViewProps {
  book: IBook;
  initialPage?: number;
}

export function ReaderDesktopView({ book, initialPage = 45 }: ReaderDesktopViewProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(book.totalPages || 612);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'book' | 'pdf'>('book');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(2); // Chapter 3 active

  // Notes state
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: '1',
      type: 'Key Quote',
      tag: 'Key Quote',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      annotationLabel: 'Key Quote',
      text: '“The mystery of life isn\'t a problem to solve, but a reality to experience. A process cannot be understood by stopping it.”',
    },
    {
      id: '2',
      type: 'My Notes',
      tag: 'Lore',
      tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      annotationLabel: 'Annotations',
      text: 'The most philosophical elements that appear in the annotations reflect key Bene Gesserit teachings and high lore doctrine.',
      highlightWords: ['Bene Gesserit', 'lore doctrine'],
    },
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // Auto-save reading progress to server
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
        console.error('Failed to sync progress:', err);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [book._id, currentPage, totalPages]);

  const chapters = [
    { id: 0, title: 'Chapter 1: The desert planet...' },
    { id: 1, title: 'Chapter 2: The spice and sand...' },
    { id: 2, title: 'Chapter 3: Bene Gesserit' },
    { id: 3, title: 'Chapter 4: The shadows of Arrakis' },
    { id: 4, title: 'Chapter 5: The awakening test' },
    { id: 5, title: 'Chapter 6: Path to the deep desert' },
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setNotes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'My Notes',
        tag: 'Annotation',
        tagColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        text: newNoteText.trim(),
      },
    ]);
    setNewNoteText('');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0e131f] text-slate-100">
      {/* Reader Sub-Header */}
      <div className="h-12 border-b border-[#1e2638] bg-[#0e131f] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/books/${book._id}`}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            ← Back
          </Link>
          <span className="text-slate-600">|</span>
          <h2 className="text-xs font-bold text-slate-200 truncate">
            {book.title} <span className="text-slate-500 font-normal">by PDF Reader</span>
          </h2>
        </div>

        {/* View mode toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#131926] border border-[#1e2638] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('book')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'book'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book View</span>
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'pdf'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Streamed PDF</span>
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#131926] border border-[#1e2638]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Center Book Viewport (75%) + Right Sidebar (25%) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Center Viewport */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-8 overflow-auto bg-[#0a0e17]">
          {viewMode === 'book' ? (
            /* Open Realistic Dual-Page Book (Matching Screenshot 2) */
            <div
              className="relative max-w-4xl w-full aspect-[16/10] max-h-[82vh] rounded-2xl overflow-hidden shadow-2xl flex border border-[#1e2638] transition-transform duration-300"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Left Page */}
              <div className="flex-1 bg-[#fcfbf7] text-[#1a1714] p-8 sm:p-12 flex flex-col justify-between font-serif relative border-r border-[#e8e4dc]">
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black tracking-tight">{book.title}</h3>
                    <p className="text-xs tracking-widest uppercase text-slate-600 mt-1">
                      by {book.author}
                    </p>
                  </div>

                  <div className="flex gap-4 items-start">
                    <span className="text-5xl font-bold leading-none float-left mr-2">D</span>
                    <p className="text-[12px] sm:text-[13px] leading-relaxed text-justify text-[#2e2925]">
                      eep in the desert planet of Arrakis, where water is the most precious treasure and
                      enormous worms rule the shifting sands, young Paul Atreides faces his trial of
                      destiny. The ancient Reverend Mother had arrived in the dead of night to test his humanity.
                    </p>
                  </div>

                  {/* Retro woodcut illustration */}
                  <div className="my-6 mx-auto w-44 aspect-[4/3] rounded-lg border border-black/30 overflow-hidden bg-black/5 flex items-center justify-center p-2 relative">
                    <div className="w-full h-full bg-gradient-to-tr from-black via-zinc-800 to-zinc-600 rounded flex flex-col items-center justify-center text-white text-center p-2">
                      <div className="w-6 h-6 rounded-full bg-white mb-2" />
                      <p className="text-[8px] tracking-widest uppercase font-sans">
                        Arrakis Dunescape
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] leading-relaxed text-justify text-[#2e2925]">
                    &quot;A human can overcome instinct,&quot; the old woman rasped. &quot;The animal traps its foot and chews it off to escape. What will you do?&quot;
                  </p>
                </div>

                <div className="text-center text-[10px] text-slate-500 font-sans tracking-widest">
                  - {currentPage} -
                </div>
              </div>

              {/* Realistic Central Crease & Spine Shadow */}
              <div className="w-4 bg-gradient-to-r from-black/15 via-black/35 to-black/15 pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 z-20 shadow-inner" />

              {/* Right Page */}
              <div className="flex-1 bg-[#fcfbf7] text-[#1a1714] p-8 sm:p-12 flex flex-col justify-between font-serif relative">
                <div className="space-y-4">
                  <p className="text-[12px] sm:text-[13px] leading-relaxed text-justify text-[#2e2925]">
                    The pain was immediate and excruciating. It felt as though flesh were charring away,
                    bone by bone, yet his fingers remained intact within the green box of agony.
                  </p>
                  <p className="text-[12px] sm:text-[13px] leading-relaxed text-justify text-[#2e2925]">
                    &quot;I must not fear. Fear is the mind-killer. Fear is the little-death that brings
                    total obliteration. I will face my fear. I will permit it to pass over me and through me.
                    And when it has gone past I will turn the inner eye to see its path.&quot;
                  </p>
                  <p className="text-[12px] sm:text-[13px] leading-relaxed text-justify text-[#2e2925]">
                    The old woman withdrew the gom jabbar poison needle from his throat. For a long moment,
                    silence filled the room, punctuated only by the distant howl of sand against plasteel.
                  </p>
                </div>

                <div className="text-center text-[10px] text-slate-500 font-sans tracking-widest">
                  - {Math.min(totalPages, currentPage + 1)} -
                </div>
              </div>
            </div>
          ) : (
            /* Streamed PDF Iframe Viewer */
            <div
              className="w-full max-w-4xl h-full rounded-2xl overflow-hidden shadow-2xl border border-[#1e2638] bg-[#0c1017]"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <iframe
                src={`/api/books/${book._id}/pdf#page=${currentPage}&toolbar=0&navpanes=0`}
                title={book.title}
                className="w-full h-full border-0 rounded-2xl"
              />
            </div>
          )}

          {/* Floating Bottom Navigation Pill Dock (Matching Screenshot 2) */}
          <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none z-30">
            <div className="pointer-events-auto flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#131926]/95 backdrop-blur-xl border border-[#1e2638] shadow-2xl text-xs text-slate-200">
              <span className="font-semibold select-none">
                Page {currentPage} of {totalPages}
              </span>

              {/* Slider Track */}
              <input
                type="range"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
                className="w-32 sm:w-44 accent-blue-500 cursor-pointer h-1.5 rounded-full bg-[#1e2638]"
              />

              <div className="w-[1px] h-3.5 bg-[#1e2638]" />

              {/* Zoom Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom((prev) => Math.max(60, prev - 10))}
                  className="p-1 rounded-md hover:bg-[#1e2638] text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-400 font-semibold w-8 text-center">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom((prev) => Math.min(160, prev + 10))}
                  className="p-1 rounded-md hover:bg-[#1e2638] text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Chapters & Reading Notes (Matching Screenshot 2) */}
        <aside className="w-80 border-l border-[#1e2638] bg-[#0e131f] flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="p-5 space-y-6">
            {/* Chapters Accordion */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Chapters
              </h3>
              <div className="space-y-1.5">
                {chapters.map((ch) => {
                  const isActive = ch.id === activeChapter;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChapter(ch.id);
                        setCurrentPage(ch.id * 35 + 1);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all ${
                        isActive
                          ? 'bg-[#1a2336] text-blue-400 font-semibold border border-blue-500/30'
                          : 'text-slate-400 hover:bg-[#131926] hover:text-slate-200'
                      }`}
                    >
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
                      <span className="truncate">{ch.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reading Notes & Highlights */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Reading Notes & Highlights
              </h3>

              <div className="space-y-3">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-2xl bg-[#131926] border border-[#1e2638] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300">{n.type}</span>
                      {n.annotationLabel && (
                        <span className="text-[10px] text-amber-400/80 italic font-mono">
                          ✎ {n.annotationLabel}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed italic">
                      {n.text}
                    </p>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${n.tagColor}`}>
                        {n.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Add Note Input */}
          <div className="p-4 border-t border-[#1e2638] bg-[#0e131f]">
            <form onSubmit={handleAddNote} className="relative flex items-center">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add a new note..."
                className="w-full pl-3.5 pr-8 py-2 rounded-xl bg-[#131926] border border-[#1e2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 text-slate-400 hover:text-blue-400 p-1"
                aria-label="Send note"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}

