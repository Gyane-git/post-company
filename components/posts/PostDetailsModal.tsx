'use client';

import React from 'react';
import { Post } from '@/types/post';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { SocialPlatformBadge } from '@/components/common/SocialPlatformBadge';
import { Button } from '@/components/ui/Button';
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
} from 'lucide-react';

interface PostDetailsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onPublishNow?: (id: string) => void;
}

export function PostDetailsModal({ post, isOpen, onClose, onPublishNow }: PostDetailsModalProps) {
  if (!post) return null;

  const media = post.media[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={post.title}
      description={`ID: ${post.id} • Created by ${post.author.name}`}
      size="xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <StatusBadge status={post.status} />
            {post.scheduledAt && (
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {new Date(post.scheduledAt).toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {post.status !== 'published' && onPublishNow && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onPublishNow(post.id);
                  onClose();
                }}
              >
                Publish Now
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Media Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 relative">
            {media ? (
              media.type === 'video' ? (
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={media.thumbnailUrl || media.url}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                    </div>
                    <span className="mt-2 text-xs font-semibold">{media.durationSec}s Video Preview</span>
                  </div>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.url}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
              )
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                No Media Attached
              </div>
            )}
          </div>

          {/* Media Info */}
          {media && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Filename:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                  {media.filename}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>File Size:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                  {(media.sizeBytes / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
              {media.aspectRatio && (
                <div className="flex justify-between text-slate-500">
                  <span>Aspect Ratio:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                    {media.aspectRatio}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Details & Analytics */}
        <div className="lg:col-span-7 space-y-5">
          {/* Target Platforms */}
          <div>
            <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Target Platforms
            </h5>
            <div className="flex flex-wrap gap-2">
              {post.platforms.map((platform) => (
                <SocialPlatformBadge key={platform} platform={platform} size="md" />
              ))}
            </div>
          </div>

          {/* Caption */}
          <div>
            <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Caption
            </h5>
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {post.caption}
            </div>
          </div>

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Hashtags ({post.hashtags.length})
              </h5>
              <div className="flex flex-wrap gap-1.5">
                {post.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Platform Publish Status Breakdown */}
          {post.publishResults && post.publishResults.length > 0 && (
            <div>
              <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Publishing Status by Channel
              </h5>
              <div className="space-y-2">
                {post.publishResults.map((result) => (
                  <div
                    key={result.platform}
                    className={`p-2.5 rounded-xl border flex items-start justify-between text-xs ${
                      result.status === 'success'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <SocialPlatformIcon platform={result.platform} size={16} />
                      <span className="font-semibold capitalize text-slate-900 dark:text-slate-100">
                        {result.platform}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 font-semibold">
                        {result.status === 'success' ? (
                          <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Published
                          </span>
                        ) : (
                          <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </div>
                      {result.errorMessage && (
                        <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 max-w-xs">
                          {result.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metrics if published */}
          {post.metrics && (
            <div>
              <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Performance Analytics
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Eye className="w-3.5 h-3.5" /> Views
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {post.metrics.views.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Heart className="w-3.5 h-3.5" /> Likes
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {post.metrics.likes.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MessageCircle className="w-3.5 h-3.5" /> Comments
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {post.metrics.comments.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Share2 className="w-3.5 h-3.5" /> Shares
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {post.metrics.shares.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
