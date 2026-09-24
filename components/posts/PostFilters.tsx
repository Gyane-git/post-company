'use client';

import React from 'react';
import { PostStatus } from '@/types/post';
import { SocialPlatform } from '@/types/social';
import { Search } from 'lucide-react';

interface PostFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: PostStatus | 'all';
  onStatusChange: (s: PostStatus | 'all') => void;
  selectedPlatform: SocialPlatform | 'all';
  onPlatformChange: (p: SocialPlatform | 'all') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function PostFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPlatform,
  onPlatformChange,
  sortBy,
  onSortChange,
}: PostFiltersProps) {
  const statusTabs: { id: PostStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All Posts' },
    { id: 'published', label: 'Published' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'draft', label: 'Drafts' },
    { id: 'failed', label: 'Failed' },
  ];

  const platforms: { id: SocialPlatform | 'all'; label: string }[] = [
    { id: 'all', label: 'All Platforms' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search, Platform & Sort Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search posts..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-8.5 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Platform Selector */}
          <div className="relative shrink-0">
            <select
              value={selectedPlatform}
              onChange={(e) => onPlatformChange(e.target.value as SocialPlatform | 'all')}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="views-desc">Most Views</option>
              <option value="engagement-desc">Highest Engagement</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
