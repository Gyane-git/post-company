'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePosts } from '@/context/posts-context';
import { useWorkspace } from '@/context/workspace-context';
import { StatCard } from '@/components/common/StatCard';
import { PageHeader } from '@/components/common/PageHeader';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { PostTable } from '@/components/posts/PostTable';
import { PostDetailsModal } from '@/components/posts/PostDetailsModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AreaChart } from '@/components/charts/AreaChart';
import { MOCK_TIMESERIES_30D } from '@/data/mock-analytics';
import { Post } from '@/types/post';
import { Button } from '@/components/ui/Button';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Share2,
  PlusCircle,
  Sparkles,
  Calendar,
  ArrowRight,
  TrendingUp,
  Radio,
} from 'lucide-react';

export default function DashboardPage() {
  const { posts, stats, deletePost, duplicatePost, publishPost } = usePosts();
  const { user, currentWorkspace, accounts, connectedCount } = useWorkspace();

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Take recent 5 posts
  const recentPosts = posts.slice(0, 5);

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      await deletePost(postToDelete);
      setPostToDelete(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
      {/* Welcome Banner & Quick Actions */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-blue-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Workspace: {currentWorkspace.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your omnichannel marketing channels are synced. You have {stats.scheduled} upcoming posts scheduled across Facebook, Instagram, TikTok, and YouTube.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href="/create">
              <Button
                variant="primary"
                size="md"
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
              >
                Create New Post
              </Button>
            </Link>

            <Link href="/ai-assistant">
              <Button
                variant="secondary"
                size="md"
                className="bg-white/15 hover:bg-white/25 text-white border-white/20 font-semibold"
                leftIcon={<Sparkles className="w-4 h-4 text-purple-300" />}
              >
                AI Assistant
              </Button>
            </Link>

            <Link href="/calendar">
              <Button
                variant="outline"
                size="md"
                className="border-white/20 text-white hover:bg-white/10 font-semibold"
                leftIcon={<Calendar className="w-4 h-4" />}
              >
                Calendar
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Posts"
          value={stats.total}
          icon={<FileText className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
          change={{ value: 14.2, label: 'vs last mo' }}
        />

        <StatCard
          title="Published"
          value={stats.published}
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          change={{ value: 8.5, label: 'on time' }}
        />

        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
          description="In queue"
        />

        <StatCard
          title="Failed"
          value={stats.failed}
          icon={<AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          change={{ value: -3.1, isPositive: true, label: 'decreased' }}
        />

        <StatCard
          title="Connected Accounts"
          value={`${connectedCount}/4`}
          icon={<Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          description="Active channels"
        />
      </div>

      {/* Platform Status Overview Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>Platform Connection Overview</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Current state of your multi-network marketing channels
            </p>
          </div>
          <Link
            href="/social-accounts"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {accounts.map((acc) => (
            <div
              key={acc.platform}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs shrink-0">
                  <SocialPlatformIcon platform={acc.platform} size={16} />
                </span>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 capitalize truncate">
                    {acc.platform}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {acc.connected ? `@${acc.username}` : 'Not connected'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 pl-2">
                {acc.connected ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                ) : (
                  <Link href="/social-accounts">
                    <span className="text-[11px] font-semibold text-blue-600 hover:underline">
                      Connect
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publishing Activity Trend & Reach Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Audience Reach & Publishing Velocity</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggregated daily reach across all 4 channels (Past 30 Days)
              </p>
            </div>
            <Link
              href="/analytics"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <AreaChart
            data={MOCK_TIMESERIES_30D}
            metricKey="reach"
            metricLabel="Total Reach"
            color="#2563eb"
            height={240}
          />
        </div>

        {/* Quick Publishing Feed */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Publishing Pipeline
            </h3>
            <p className="text-xs text-slate-400 mb-4">Upcoming and recent status</p>

            <div className="space-y-3">
              {recentPosts.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPost(p)}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {p.platforms.map((plat) => (
                        <span key={plat} className="text-slate-500">
                          <SocialPlatformIcon platform={plat} size={11} />
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">
                        • {p.status === 'scheduled' ? 'Scheduled' : 'Published'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      p.status === 'published'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : p.status === 'scheduled'
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/calendar"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1"
            >
              <span>View Full Calendar Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Posts Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Marketing Posts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live status, target networks, and engagement metrics
            </p>
          </div>
          <Link
            href="/content"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({stats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <PostTable
          posts={recentPosts}
          onView={(p) => setSelectedPost(p)}
          onDuplicate={(id) => duplicatePost(id)}
          onDelete={(id) => setPostToDelete(id)}
        />
      </div>

      {/* Post Details Modal */}
      <PostDetailsModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPublishNow={(id) => publishPost(id)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action will remove it from all scheduling queues."
        confirmLabel="Delete Post"
        variant="danger"
      />
    </div>
  );
}
