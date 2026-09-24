'use client';

import React from 'react';
import { Post } from '@/types/post';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/Button';
import { Calendar, Clock, Eye, MoreHorizontal } from 'lucide-react';

interface CalendarListViewProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export function CalendarListView({ posts, onSelectPost }: CalendarListViewProps) {
  if (posts.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No scheduled posts found</p>
        <p className="text-xs text-slate-400 mt-1">Schedule your first post from the composer or calendar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
      {posts.map((post) => {
        const media = post.media[0];
        const dateObj = post.scheduledAt ? new Date(post.scheduledAt) : new Date(post.createdAt);
        const dateFormatted = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const timeFormatted = dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
          >
            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
              {/* Media Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                {media ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={media.thumbnailUrl || media.url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                    None
                  </div>
                )}
              </div>

              {/* Title & Platforms */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h4>
                  <StatusBadge status={post.status} size="sm" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {post.caption}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {post.platforms.map((p) => (
                      <span
                        key={p}
                        className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
                      >
                        <SocialPlatformIcon platform={p} size={11} />
                      </span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    • {post.hashtags.length} hashtags
                  </span>
                </div>
              </div>
            </div>

            {/* Time & Action Button */}
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="text-left sm:text-right">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span>{dateFormatted}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 sm:justify-end mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{timeFormatted} (Asia/Kathmandu)</span>
                </div>
              </div>

              <Button size="sm" variant="outline" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                Details
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
