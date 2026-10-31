'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Heart, Github } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide Footer on PDF reader
  if (pathname.includes('/read')) {
    return null;
  }

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 dark:bg-[#050810]/80 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-glow-sm">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Student<span className="text-gradient font-black">Lib</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              A high-performance digital library platform for students to browse, read, organize personal reading shelves, and track learning progress online.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/books" className="hover:text-indigo-400 transition-colors">
                  All Books
                </Link>
              </li>
              <li>
                <Link href="/shelf" className="hover:text-indigo-400 transition-colors">
                  Personal Shelf
                </Link>
              </li>
              <li>
                <Link href="/books?category=Computer+Science" className="hover:text-indigo-400 transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link href="/books?category=Fiction" className="hover:text-indigo-400 transition-colors">
                  Fiction & Literature
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-400 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            Built with Next.js 14 App Router & TypeScript
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Tarun Rawat
          </p>
        </div>
      </div>
    </footer>
  );
}

