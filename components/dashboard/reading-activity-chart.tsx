'use client';

import React from 'react';

export function ReadingActivityChart() {
  const days = [
    { day: 'Mon', hours: 4.5, heightPercent: 28 },
    { day: 'Tue', hours: 8.2, heightPercent: 51 },
    { day: 'Wed', hours: 7.8, heightPercent: 49 },
    { day: 'Thu', hours: 5.0, heightPercent: 31 },
    { day: 'Fri', hours: 13.5, heightPercent: 84 },
    { day: 'Sat', hours: 15.0, heightPercent: 94 },
    { day: 'Sun', hours: 6.0, heightPercent: 37 },
  ];

  // SVG dimensions for smooth spline
  // Points calculated to form the gorgeous glowing curve from the screenshot
  const points = [
    { x: 30, y: 155 },
    { x: 95, y: 115 },
    { x: 160, y: 120 },
    { x: 225, y: 145 },
    { x: 290, y: 65 },
    { x: 355, y: 45 },
    { x: 420, y: 135 },
  ];

  // Smooth SVG path using cubic bezier
  const svgPath = `
    M ${points[0].x} ${points[0].y}
    C 60 135, 75 115, ${points[1].x} ${points[1].y}
    C 115 115, 140 120, ${points[2].x} ${points[2].y}
    C 180 120, 205 145, ${points[3].x} ${points[3].y}
    C 245 145, 270 75, ${points[4].x} ${points[4].y}
    C 310 55, 335 45, ${points[5].x} ${points[5].y}
    C 375 45, 400 120, ${points[6].x} ${points[6].y}
  `;

  const svgArea = `
    ${svgPath}
    L ${points[6].x} 190
    L ${points[0].x} 190
    Z
  `;

  return (
    <div className="p-6 rounded-3xl bg-[#131926] border border-[#1e2638] space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Reading Activity</h3>
        <span className="text-xs text-slate-400 font-medium">Last 7 Days</span>
      </div>

      <div className="relative w-full h-56 flex items-end">
        {/* Left Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] text-slate-500 font-medium select-none">
          <span>16h</span>
          <span>12h</span>
          <span>6h</span>
          <span>0h</span>
        </div>

        {/* Horizontal grid guide lines */}
        <div className="absolute left-8 right-0 top-1 bottom-6 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="w-full border-b border-dashed border-slate-600" />
          <div className="w-full border-b border-dashed border-slate-600" />
          <div className="w-full border-b border-dashed border-slate-600" />
          <div className="w-full border-b border-slate-600" />
        </div>

        {/* Area and Line Graph overlay */}
        <div className="absolute left-8 right-0 inset-y-0 bottom-6 pointer-events-none">
          <svg
            viewBox="0 0 450 200"
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            {/* Filled Area */}
            <path d={svgArea} fill="url(#areaGradient)" />

            {/* Glowing Spline Curve */}
            <path
              d={svgPath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2.5"
              className="drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
            />

            {/* Point circles */}
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#ffffff"
                stroke="#38bdf8"
                strokeWidth="2"
                className="drop-shadow-[0_0_6px_rgba(56,189,248,1)]"
              />
            ))}
          </svg>
        </div>

        {/* Vertical Bars and Day labels */}
        <div className="pl-10 w-full h-full flex items-end justify-between z-10">
          {days.map((item) => (
            <div key={item.day} className="flex-1 flex flex-col items-center h-full justify-end group">
              {/* Bar Pill */}
              <div className="w-7 sm:w-9 bg-[#1a2336] rounded-t-lg relative flex items-end justify-center overflow-hidden mb-2">
                <div
                  className="w-full bg-gradient-to-t from-blue-600 via-sky-400 to-cyan-300 rounded-t-lg transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:shadow-glow-sm"
                  style={{ height: `${item.heightPercent}%` }}
                />
              </div>

              {/* Day Label */}
              <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

