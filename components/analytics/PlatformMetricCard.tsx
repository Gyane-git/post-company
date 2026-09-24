'use client';

import React from 'react';
import { PlatformMetrics } from '@/types/analytics';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Users, Eye, TrendingUp, FileText } from 'lucide-react';

interface PlatformMetricCardProps {
  metrics: PlatformMetrics;
}

export function PlatformMetricCard({ metrics }: PlatformMetricCardProps) {
  const colors: Record<string, string> = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    tiktok: '#111827',
    youtube: '#FF0000',
  };

  const color = colors[metrics.platform] || '#3b82f6';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: `${color}15`, color }}
            >
              <SocialPlatformIcon platform={metrics.platform} size={18} />
            </span>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {metrics.displayName}
              </h4>
              <p className="text-[11px] text-slate-400">
                {metrics.postsCount} posts tracked
              </p>
            </div>
          </div>

          {metrics.followers > 0 && (
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              +{metrics.followersChange.toLocaleString()} this mo
            </span>
          )}
        </div>

        {/* Primary metric */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
          <span className="text-xs text-slate-500">Total Followers</span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {metrics.followers.toLocaleString()}
          </span>
        </div>

        {/* Secondary metrics grid */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Reach</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">
              {metrics.reach.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Video Views</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">
              {metrics.views.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Engagement</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block font-mono">
              {metrics.engagement.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-850 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Eng. Rate</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block font-mono">
              {metrics.engagementRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
