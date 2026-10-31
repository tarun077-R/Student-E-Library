import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { Book } from '@/lib/models/Book';
import { ShelfActionButton } from '@/components/book-details/shelf-action-button';
import { IBook } from '@/types';
import { BookOpen, Star, ArrowLeft, Download, Calendar, User, FileText } from 'lucide-react';

interface BookPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

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
      title: 'Book Not Found | Library',
    };
  }

  const title = `${book.title} by ${book.author}`;
  const description = book.description || `Read ${book.title} online on Library.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Library`,
      description,
      type: 'book',
      images: book.coverImage ? [{ url: book.coverImage, alt: book.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Library`,
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
      : 'Library Admin';

  const formattedDate = new Date(book.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back button */}
      <div>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse</span>
        </Link>
      </div>

      {/* Showcase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cover Column */}
        <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center">
          <div className="relative w-56 sm:w-64 md:w-full aspect-[3/4.4] rounded-2xl overflow-hidden bg-[#131926] border border-[#1e2638] shadow-2xl">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#131926]">
                <BookOpen className="w-16 h-16 text-slate-600 mb-3" />
                <p className="text-sm font-bold text-white line-clamp-2">{book.title}</p>
                <p className="text-xs text-slate-400 mt-1">{book.author}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 mt-4 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400" />
            ))}
            <span className="text-xs font-bold text-slate-400 ml-2">4.9 Reader Score</span>
          </div>
        </div>

        {/* Details Column */}
        <div className="md:col-span-8 lg:col-span-8 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#131926] text-blue-400 border border-[#1e2638]">
              {book.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              {book.title}
            </h1>
            <p className="text-base text-slate-300 font-medium mt-1">
              by <span className="text-blue-400">{book.author}</span>
            </p>
          </div>

          {/* Key Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#131926] border border-[#1e2638]">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Published
              </span>
              <p className="text-xs font-bold text-white mt-1">{formattedDate}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#131926] border border-[#1e2638]">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> Contributor
              </span>
              <p className="text-xs font-bold text-white mt-1 truncate">{uploadedByName}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#131926] border border-[#1e2638] col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Format
              </span>
              <p className="text-xs font-bold text-white mt-1">High-Res Digital Book</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={`/books/${book._id}/read`}
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Reading</span>
            </Link>

            <ShelfActionButton bookId={book._id} />

            <a
              href={`/api/books/${book._id}/pdf`}
              download={`${book.title}.pdf`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#131926] text-slate-300 hover:text-white font-semibold text-xs transition-all border border-[#1e2638]"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Download</span>
            </a>
          </div>

          <div className="border-t border-[#1e2638] my-6" />

          {/* Synopsis */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Synopsis & Notes
            </h2>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {book.description ||
                'No description available for this title yet. Click Start Reading to dive directly into the text.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
