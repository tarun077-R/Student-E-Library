import Link from 'next/link';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';
import { BookCard } from '@/components/book-card';
import { BookOpen, Sparkles, Bookmark, Layers, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { IBook } from '@/types';

export const dynamic = 'force-dynamic';

async function getFeaturedBooks(): Promise<IBook[]> {
  try {
    await connectToDatabase();
    const books = await Book.find().sort({ createdAt: -1 }).limit(6).lean();
    return JSON.parse(JSON.stringify(books));
  } catch (error) {
    console.error('Failed to load featured books:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooks();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Ambient Glowing Orbs Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[130px] -z-10 pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel text-xs font-semibold text-indigo-300 border border-indigo-500/30 shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Modern Full-Stack Digital Library v2.0</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Read, Organize & Elevate Your <br />
            <span className="text-gradient">Student Journey</span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
            Discover a curated universe of textbooks, literature, and research papers. Enjoy a distraction-free reader, personal Kanban shelf tracking, and seamless cross-device reading.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/books"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-glow-md hover:shadow-glow-lg transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Explore All Books
            </Link>

            <Link
              href="/shelf"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-slate-800/60 font-semibold text-sm transition-all border border-slate-800 hover:border-slate-700"
            >
              <Bookmark className="w-4 h-4 text-indigo-400" />
              Open My Shelf
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Books Available', value: '1,000+' },
              { label: 'Student Readers', value: '5,000+' },
              { label: 'CORS-Free Streaming', value: '100%' },
              { label: 'Open Access', value: 'Free' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl glass-panel border border-slate-800/80">
                <p className="text-xl sm:text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Zap className="w-4 h-4" /> Fresh In Library
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Featured & Trending Books
            </h2>
          </div>

          <Link
            href="/books"
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No books in catalog yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Platform Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Crafted for Focus
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-1">
            Why Students Love Our E-Library
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: 'Distraction-Free PDF Reader',
              description:
                'Read comfortably with customized Dark Slate, Warm Sepia, and Paper themes. Zoom, jump pages, and auto-save reading positions on the fly.',
            },
            {
              icon: Layers,
              title: 'Interactive Shelf Kanban',
              description:
                'Organize your reading journey. Categorize titles into Currently Reading, Saved, and Completed with dynamic page progress bars.',
            },
            {
              icon: ShieldCheck,
              title: 'Curated Academic Categories',
              description:
                'Easily filter across Computer Science, Mathematics, Physics, Fiction, and Web Engineering with instant real-time tag pills.',
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl glass-panel border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

