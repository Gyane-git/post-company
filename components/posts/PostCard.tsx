'use client';

import React from 'react';
import { Post } from '@/types/post';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Dropdown } from '@/components/ui/Dropdown';
import { MoreVertical, Eye, Copy, Trash2, Calendar, Play } from 'lucide-react';

interface PostCardProps {
  post: Post;
  onView: (post: Post) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PostCard({ post, onView, onDuplicate, onDelete }: PostCardProps) {
  const media = post.media[0];
  const dateFormatted = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : post.scheduledAt
    ? new Date(post.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col group">
      {/* Media Thumbnail */}
      <div
        onClick={() => onView(post)}
        className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
      >
        {media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.thumbnailUrl || media.url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            No media attached
          </div>
        )}

        {media?.type === 'video' && (
          <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-semibold">
            <Play className="w-3 h-3 fill-white" />
            {media.durationSec ? `${media.durationSec}s` : 'Video'}
          </div>
        )}

        <div className="absolute bottom-2.5 left-2.5">
          <StatusBadge status={post.status} size="sm" />
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h4
              onClick={() => onView(post)}
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              {post.title}
            </h4>
            <Dropdown
              trigger={
                <button
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Post actions"
                >
                  <MoreVertical className="w-4 h-4" />
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
          </div>

          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {post.caption}
          </p>

          {post.hashtags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {post.hashtags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-blue-600 dark:text-blue-400 font-medium"
                >
                  {tag}
                </span>
              ))}
              {post.hashtags.length > 3 && (
                <span className="text-[10px] text-slate-400">+{post.hashtags.length - 3}</span>
              )}
            </div>
          )}
        </div>

        {/* Footer info: Platforms and Date */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {post.platforms.map((plt) => (
              <span
                key={plt}
                className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
                title={plt}
              >
                <SocialPlatformIcon platform={plt} size={13} />
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{dateFormatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
