'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Search, LogOut, User as UserIcon, BookOpen, Menu, X } from 'lucide-react';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/books?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/books');
    }
  };

  const navTabs = [
    { label: 'My Library', href: '/shelf' },
    { label: 'Browse', href: '/books' },
    { label: 'Dashboard', href: '/dashboard' },
    ...(user?.role === 'admin' ? [{ label: 'Admin', href: '/admin' }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-[#0e131f]/95 backdrop-blur-xl border-b border-[#1e2638] flex items-center justify-between px-4 sm:px-6 md:pl-[16.5rem] transition-all">
      {/* Mobile Brand Hamburger */}
      <div className="flex md:hidden items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-base text-white">Library</span>
        </Link>
      </div>

      {/* Global Omnibox Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm sm:max-w-md hidden sm:block">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search titles, authors, genres..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131926] border border-[#1e2638] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-colors"
        />
      </form>

      {/* Center / Right Tabs */}
      <div className="flex items-center gap-4 sm:gap-6">
        <nav className="hidden md:flex items-center gap-6">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative py-5 text-xs font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-blue-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Pill */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#131926] border border-[#1e2638] hover:border-slate-700 transition-all text-left"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[90px]">
                {user.name}
              </span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#131926] border border-[#1e2638] shadow-2xl p-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#1e2638]">
                  <p className="font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#0e131f] border-b border-[#1e2638] p-4 space-y-2 z-50">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library..."
              className="w-full px-3 py-2 rounded-xl bg-[#131926] border border-[#1e2638] text-xs text-white"
            />
          </form>
          {navTabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-[#131926]"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

