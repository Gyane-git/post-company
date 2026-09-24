'use client';

import React from 'react';
import { Post } from '@/types/post';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Dropdown } from '@/components/ui/Dropdown';
import { MoreHorizontal, Eye, Copy, Trash2, Edit3, Play } from 'lucide-react';
import Link from 'next/link';

interface PostTableProps {
  posts: Post[];
  onView: (post: Post) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PostTable({ posts, onView, onDuplicate, onDelete }: PostTableProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 text-slate-500 dark:text-slate-400 font-semibold">
            <th className="py-3 px-4 w-16">Media</th>
            <th className="py-3 px-4 min-w-[220px]">Post & Caption</th>
            <th className="py-3 px-4 min-w-[120px]">Platforms</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 min-w-[130px]">Date</th>
            <th className="py-3 px-4 min-w-[130px]">Engagement</th>
            <th className="py-3 px-4 text-right w-16">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {posts.map((post) => {
            const media = post.media[0];
            const dateStr = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : post.scheduledAt
              ? new Date(post.scheduledAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

            return (
              <tr
                key={post.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
              >
                {/* Thumbnail */}
                <td className="py-3 px-4">
                  <div
                    onClick={() => onView(post)}
                    className="relative w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 cursor-pointer"
                  >
                    {media ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={media.thumbnailUrl || media.url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                        None
                      </div>
                    )}
                    {media?.type === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-white fill-white" />
                      </div>
                    )}
                  </div>
                </td>

                {/* Caption / Title */}
                <td className="py-3 px-4">
                  <div className="max-w-md">
                    <button
                      onClick={() => onView(post)}
                      className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 text-left line-clamp-1 transition-colors cursor-pointer"
                    >
                      {post.title}
                    </button>
                    <p className="mt-0.5 text-slate-500 dark:text-slate-400 line-clamp-1">
                      {post.caption}
                    </p>
                  </div>
                </td>

                {/* Platforms */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {post.platforms.map((p) => (
                      <span
                        key={p}
                        className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300"
                        title={p}
                      >
                        <SocialPlatformIcon platform={p} size={13} />
                      </span>
                    ))}
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <StatusBadge status={post.status} size="sm" />
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  <div>{dateStr}</div>
                  <div className="text-[10px] text-slate-400">
                    {post.status === 'published'
                      ? 'Published'
                      : post.status === 'scheduled'
                      ? 'Scheduled'
                      : 'Created'}
                  </div>
                </td>

                {/* Engagement */}
                <td className="py-3 px-4">
                  {post.metrics ? (
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {post.metrics.views.toLocaleString()} views
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {post.metrics.engagementRate}% rate • {post.metrics.likes} likes
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">—</span>
                  )}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <Dropdown
                    trigger={
                      <button
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        aria-label="Actions"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      {
                        id: 'view',
                        label: 'View Details',
                        icon: <Eye className="w-3.5 h-3.5" />,
                        onClick: () => onView(post),
                      },
                      {
                        id: 'duplicate',
                        label: 'Duplicate',
                        icon: <Copy className="w-3.5 h-3.5" />,
                        onClick: () => onDuplicate(post.id),
                      },
                      'separator',
                      {
                        id: 'delete',
                        label: 'Delete Post',
                        icon: <Trash2 className="w-3.5 h-3.5" />,
                        danger: true,
                        onClick: () => onDelete(post.id),
                      },
                    ]}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
