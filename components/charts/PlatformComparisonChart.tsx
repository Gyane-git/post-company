'use client';

import React from 'react';
import { PlatformMetrics } from '@/types/analytics';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';

interface PlatformComparisonChartProps {
  platforms: PlatformMetrics[];
  metricKey: 'reach' | 'followers' | 'views' | 'engagement';
  metricLabel: string;
}

export function PlatformComparisonChart({
  platforms,
  metricKey,
  metricLabel,
}: PlatformComparisonChartProps) {
  const maxValue = Math.max(...platforms.map((p) => p[metricKey]), 1);

  const colors: Record<string, string> = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    tiktok: '#111827',
    youtube: '#FF0000',
  };

  return (
    <div className="space-y-4">
      {platforms.map((item) => {
        const value = item[metricKey];
        const percentage = Math.round((value / maxValue) * 100);
        const color = colors[item.platform] || '#3b82f6';

        return (
          <div key={item.platform} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span style={{ color }}>
                  <SocialPlatformIcon platform={item.platform} size={15} />
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.displayName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {value.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({percentage}%)
                </span>
                {metricLabel && (
                  <span className="text-[10px] text-slate-400 font-medium">
                    {metricLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.max(percentage, 2)}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
