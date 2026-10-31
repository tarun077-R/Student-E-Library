import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';
import { ShelfActionButton } from '@/components/book-details/shelf-action-button';
import { IBook } from '@/types';
import { BookOpen, Star, ArrowLeft, Download, Calendar, User, FileText, Sparkles } from 'lucide-react';

interface BookPageProps {
  params: {
    id: string;
  };
}

async function getBook(id: string): Promise<IBook | null> {
  try {
    await connectToDatabase();
    const book = await Book.findById(id).populate('uploadedBy', 'name email').lean();
    if (!book) return null;
    return JSON.parse(JSON.stringify(book));
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const book = await getBook(params.id);

  if (!book) {
    return {
      title: 'Book Not Found | Student E-Library',
    };
  }

  const title = `${book.title} by ${book.author}`;
  const description = book.description || `Read ${book.title} online for free on Student E-Library.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Student E-Library`,
      description,
      type: 'book',
      images: book.coverImage ? [{ url: book.coverImage, alt: book.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Student E-Library`,
      description,
      images: book.coverImage ? [book.coverImage] : [],
    },
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const book = await getBook(params.id);

  if (!book) {
    notFound();
  }

  // Schema.org structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    genre: book.category,
    image: book.coverImage,
    description: book.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/books/${book._id}`,
  };

  const uploadedByName =
    typeof book.uploadedBy === 'object' && book.uploadedBy !== null
      ? (book.uploadedBy as any).name
      : 'E-Library Admin';

  const formattedDate = new Date(book.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Structured JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back to Catalog button */}
      <div className="mb-8">
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Book Cover with Ambient Reflection Glow */}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center">
          <div className="relative w-56 sm:w-64 md:w-full aspect-[3/4] rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl group">
            {/* Ambient Back Glow */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-40 -z-10 scale-110"
              style={{ backgroundImage: `url(${book.coverImage || ''})` }}
            />

            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 to-indigo-950">
                <BookOpen className="w-16 h-16 text-indigo-400/60 mb-3" />
                <p className="text-sm font-bold text-white line-clamp-2">{book.title}</p>
                <p className="text-xs text-slate-400 mt-1">{book.author}</p>
              </div>
            )}
          </div>

          {/* Rating Indicator */}
          <div className="flex items-center gap-1.5 mt-5 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-amber-400" />
            ))}
            <span className="text-xs font-bold text-slate-300 ml-1.5">5.0 (Reader Score)</span>
          </div>
        </div>

        {/* Right Column: Book Details & Actions */}
        <div className="md:col-span-8 lg:col-span-8 space-y-6">
          {/* Eyebrow & Category Badge */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {book.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Verified Content
            </span>
          </div>

          {/* Title and Author */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {book.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium mt-2">
              by <span className="text-indigo-300 font-semibold">{book.author}</span>
            </p>
          </div>

          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl glass-panel border border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Uploaded
              </span>
              <p className="text-xs font-bold text-white mt-1">{formattedDate}</p>
            </div>

            <div className="p-3 rounded-2xl glass-panel border border-slate-800/80">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Contributor
              </span>
              <p className="text-xs font-bold text-white mt-1 truncate">{uploadedByName}</p>
            </div>

            <div className="p-3 rounded-2xl glass-panel border border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Format
              </span>
              <p className="text-xs font-bold text-white mt-1">High-Res Digital PDF</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link
              href={`/books/${book._id}/read`}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm shadow-glow-md hover:shadow-glow-lg transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Reading Now</span>
            </Link>

            <ShelfActionButton bookId={book._id} />

            <a
              href={`/api/books/${book._id}/pdf`}
              download={`${book.title}.pdf`}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl glass-panel text-slate-300 hover:text-white hover:bg-slate-800/60 font-semibold text-xs transition-all border border-slate-800"
              title="Download PDF"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download</span>
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800/80 my-6" />

          {/* Synopsis */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Synopsis & Overview
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {book.description ||
                'No detailed description has been provided for this book yet. Click Start Reading above to dive into the full text.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
