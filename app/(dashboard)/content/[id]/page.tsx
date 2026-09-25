'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePosts } from '@/context/posts-context';
import { postsService } from '@/services/posts.service';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SocialPlatformBadge } from '@/components/common/SocialPlatformBadge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/common/LoadingState';
import { Post } from '@/types/post';
import {
  ArrowLeft,
  Clock,
  Play,
  Copy,
  Trash2,
  Send,
} from 'lucide-react';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { posts, deletePost, duplicatePost, publishPost } = usePosts();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    const existing = posts.find((p) => p.id === id);
    if (existing) {
      setPost(existing);
      setLoading(false);
    } else {
      setLoading(true);
      postsService
        .getPostById(id)
        .then((data) => {
          if (data) setPost(data);
        })
        .finally(() => setLoading(false));
    }
  }, [id, posts]);

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState type="full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Post not found</h2>
        <p className="text-xs text-slate-400 mt-1">The requested post does not exist or was deleted.</p>
        <div className="mt-4">
          <Link href="/content">
            <Button size="sm" variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Content
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const media = post.media[0];

  const handleDuplicate = async () => {
    setActionLoading(true);
    try {
      const dup = await duplicatePost(post.id);
      router.push(`/content/${dup.id}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    setActionLoading(true);
    try {
      const updated = await publishPost(post.id);
      setPost(updated);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      setActionLoading(true);
      try {
        await deletePost(post.id);
        router.push('/content');
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <PageHeader
        title={post.title}
        description={`Author: ${post.author.name} • Created: ${new Date(post.createdAt).toLocaleDateString()}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content', href: '/content' },
          { label: post.id },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDuplicate}
              disabled={actionLoading}
              leftIcon={<Copy className="w-3.5 h-3.5" />}
            >
              Duplicate
            </Button>
            {post.status !== 'published' && (
              <Button
                size="sm"
                variant="primary"
                onClick={handlePublish}
                isLoading={actionLoading}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Publish Now
              </Button>
            )}
            <Button
              size="sm"
              variant="danger"
              onClick={handleDelete}
              disabled={actionLoading}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Media Frame */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 relative aspect-video flex items-center justify-center">
            {media ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.thumbnailUrl || media.url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-slate-400">No media attached</span>
            )}
            {media?.type === 'video' && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play className="w-6 h-6 fill-white translate-x-0.5" />
                </div>
              </div>
            )}
          </div>

          {/* Meta card */}
          {media && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>File Name:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{media.filename}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>File Size:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                  {(media.sizeBytes / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Aspect Ratio:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{media.aspectRatio || '16:9'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Details & Performance */}
        <div className="lg:col-span-7 space-y-5">
          {/* Target Platforms & Status */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <StatusBadge status={post.status} size="md" />
              {post.scheduledAt && (
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Scheduled for {new Date(post.scheduledAt).toLocaleString()}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Platforms</p>
              <div className="flex flex-wrap gap-2">
                {post.platforms.map((plt) => (
                  <SocialPlatformBadge key={plt} platform={plt} size="md" />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Caption</p>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {post.caption}
              </div>
            </div>

            {post.hashtags.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hashtags</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.hashtags.map((h) => (
                    <span key={h} className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Performance stats if published */}
          {post.metrics && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Engagement & Impressions
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                  <span className="text-xs text-slate-400">Views</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                    {post.metrics.views.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                  <span className="text-xs text-slate-400">Likes</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                    {post.metrics.likes.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                  <span className="text-xs text-slate-400">Comments</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                    {post.metrics.comments.toLocaleString()}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl">
                  <span className="text-xs text-slate-400">Rate</span>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    {post.metrics.engagementRate}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
