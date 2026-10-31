'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IBook } from '@/types';
import { Search, ExternalLink, Trash2, BookOpen, AlertTriangle, Loader2 } from 'lucide-react';

interface BookTableProps {
  books: IBook[];
  onRefresh: () => void;
}

export function BookTable({ books, onRefresh }: BookTableProps) {
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredBooks = books.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true);
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleteId(null);
        onRefresh();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative flex items-center max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter catalog books..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Table Container */}
      <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Cover</th>
                <th className="px-5 py-3.5">Title & Author</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Published</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-slate-900/40 transition-colors">
                  {/* Cover Thumbnail */}
                  <td className="px-5 py-3">
                    <div className="w-9 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">
                          📖
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Title & Author */}
                  <td className="px-5 py-3">
                    <p className="font-bold text-white max-w-xs truncate">{book.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{book.author}</p>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-medium text-indigo-300">
                      {book.category}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-3 text-slate-400">
                    {new Date(book.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/books/${book._id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="View details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setDeleteId(book._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete book"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No books found matching &quot;{search}&quot;</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Delete Dialog Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl glass-panel p-6 border border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Permanently Delete Book?</h3>
              <p className="text-xs text-slate-400 mt-1">
                This action will delete the book from the library catalog and remove it from student shelves.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
