'use client';

import React from 'react';
import { SocialPlatform } from '@/types/social';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';

interface DonutItem {
  platform: SocialPlatform;
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  items: DonutItem[];
  title?: string;
  totalLabel?: string;
}

export function DonutChart({ items, title, totalLabel = 'Total' }: DonutChartProps) {
  const total = items.reduce((sum, i) => sum + i.value, 0);

  let accumulatedPercent = 0;
  const radius = 38;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* SVG Ring */}
      <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-slate-100 dark:text-slate-800"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            items.map((item) => {
              const percent = item.value / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={item.platform}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              );
            })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[11px] text-slate-400 font-medium">{totalLabel}</span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
            {total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2.5 w-full">
        {title && <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{title}</h4>}
        {items.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.platform} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-medium">
                  <SocialPlatformIcon platform={item.platform} size={13} />
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{item.value.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 w-8 text-right font-mono">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
