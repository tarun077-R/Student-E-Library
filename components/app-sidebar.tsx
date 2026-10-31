'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  LayoutDashboard,
  BookMarked,
  FolderKanban,
  Bookmark,
  CheckCircle,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [myBooksOpen, setMyBooksOpen] = useState(true);

  // If in pure reader mode, sidebar can be collapsible or hidden
  const isReader = pathname.includes('/read');

  const myBooksItems = [
    { label: 'All', href: '/books' },
    { label: 'Reading', href: '/shelf?tab=reading' },
    { label: 'Finished', href: '/shelf?tab=completed' },
    { label: 'Want to Read', href: '/shelf?tab=saved' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-60 bg-[#0e131f] border-r border-[#1e2638] flex flex-col justify-between transition-all duration-300 ${
        isReader ? 'hidden lg:flex' : 'hidden md:flex'
      }`}
    >
      {/* Top Header / Logo */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="h-16 flex items-center px-6 gap-3 border-b border-[#1e2638]/60">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-glow-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">Library</span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 text-xs">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
              pathname === '/dashboard'
                ? 'bg-[#1e2638] text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#131926]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>Dashboard</span>
          </Link>

          {/* My Books Collapsible */}
          <div>
            <button
              onClick={() => setMyBooksOpen(!myBooksOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-[#131926] transition-colors"
            >
              <div className="flex items-center gap-3">
                <BookMarked className="w-4 h-4 text-slate-400" />
                <span>My Books</span>
              </div>
              {myBooksOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {myBooksOpen && (
              <div className="ml-8 mt-1 space-y-1 border-l border-[#1e2638] pl-2">
                {myBooksItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                      pathname === item.href
                        ? 'text-white font-semibold bg-[#1e2638]/80'
                        : 'text-slate-400 hover:text-white hover:bg-[#131926]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Collections / Shelves */}
          <Link
            href="/shelf"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
              pathname === '/shelf'
                ? 'bg-[#1e2638] text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#131926]'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-slate-400" />
            <span>Collections</span>
          </Link>

          {/* Loans */}
          <Link
            href="/books"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-[#131926] transition-colors"
          >
            <Bookmark className="w-4 h-4 text-slate-400" />
            <span>Loans</span>
          </Link>

          {/* Reading Goals */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-[#131926] transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-slate-400" />
            <span>Reading Goals</span>
          </Link>

          {/* Admin link if user is admin */}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors ${
                pathname === '/admin'
                  ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                  : 'text-blue-400 hover:text-blue-300 hover:bg-[#131926]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Bottom Settings */}
      <div className="p-4 border-t border-[#1e2638]/60">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-[#131926] transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}

