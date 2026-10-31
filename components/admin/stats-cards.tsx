'use client';

import React from 'react';
import { StatsResponse } from '@/types';
import { BookOpen, Users, Sparkles, Bookmark, PieChart } from 'lucide-react';

interface StatsCardsProps {
  stats: StatsResponse | null;
}

export function StatsCards({ stats }: StatsCardsProps) {
  if (!stats) return null;

  const kpis = [
    {
      label: 'Total Books in Library',
      value: stats.totalBooks,
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-600/10 border-blue-500/20',
      glow: 'hover:border-blue-500/40',
    },
    {
      label: 'Registered Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      glow: 'hover:border-cyan-500/40',
    },
    {
      label: 'Active Readers',
      value: stats.activeReaders,
      icon: Sparkles,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      glow: 'hover:border-amber-500/40',
    },
    {
      label: 'Books on Shelves',
      value: stats.totalShelved,
      icon: Bookmark,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      glow: 'hover:border-emerald-500/40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`p-5 rounded-2xl bg-[#131926] border border-[#1e2638] transition-all ${kpi.glow}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{kpi.label}</span>
                <div className={`p-2 rounded-xl border ${kpi.bg}`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      {/* Category Distribution Breakdown */}
      {stats.categoryStats && stats.categoryStats.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#131926] border border-[#1e2638] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <PieChart className="w-4 h-4 text-blue-400" />
            <span>Category Distribution</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {stats.categoryStats.map((cat) => (
              <div
                key={cat.name}
                className="px-3.5 py-1.5 rounded-full bg-[#0e131f] border border-[#1e2638] flex items-center gap-2 text-xs"
              >
                <span className="text-slate-300 font-medium">{cat.name}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-600/30 text-blue-300 text-[10px] font-bold">
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

