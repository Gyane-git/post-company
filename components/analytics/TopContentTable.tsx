'use client';

import React from 'react';
import { TopPerformingPost } from '@/types/analytics';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Eye, Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';

interface TopContentTableProps {
  posts: TopPerformingPost[];
}

export function TopContentTable({ posts }: TopContentTableProps) {
  return (
    <div className="w-full overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 text-slate-500 font-semibold">
            <th className="py-3 px-4">Post & Content</th>
            <th className="py-3 px-4">Platform</th>
            <th className="py-3 px-4">Views</th>
            <th className="py-3 px-4">Likes</th>
            <th className="py-3 px-4">Comments</th>
            <th className="py-3 px-4">Shares</th>
            <th className="py-3 px-4 text-right">Engagement</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="max-w-xs">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{post.caption}</p>
                  </div>
                </div>
              </td>

              <td className="py-3 px-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium capitalize text-[11px]">
                  <SocialPlatformIcon platform={post.platform} size={12} />
                  <span>{post.platform}</span>
                </span>
              </td>

              <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-slate-100">
                {post.views.toLocaleString()}
              </td>

              <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                {post.likes.toLocaleString()}
              </td>

              <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                {post.comments.toLocaleString()}
              </td>

              <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                {post.shares.toLocaleString()}
              </td>

              <td className="py-3 px-4 text-right">
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full text-xs">
                  <TrendingUp className="w-3 h-3" />
                  {post.engagementRate}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
