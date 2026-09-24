'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePosts } from '@/context/posts-context';
import { PageHeader } from '@/components/common/PageHeader';
import { CalendarMonthView } from '@/components/calendar/CalendarMonthView';
import { CalendarWeekView } from '@/components/calendar/CalendarWeekView';
import { CalendarListView } from '@/components/calendar/CalendarListView';
import { ScheduleModal } from '@/components/calendar/ScheduleModal';
import { PostDetailsModal } from '@/components/posts/PostDetailsModal';
import { Button } from '@/components/ui/Button';
import { Post } from '@/types/post';
import { SocialPlatform } from '@/types/social';
import { APP_CONFIG } from '@/config/app-config';
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Globe2,
} from 'lucide-react';

export default function CalendarPage() {
  const { posts, stats, createPost, publishPost } = usePosts();

  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 24)); // September 2026 default baseline
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'published' | 'failed'>('all');
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | 'all'>('all');

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (platformFilter !== 'all' && !p.platforms.includes(platformFilter)) return false;
      return true;
    });
  }, [posts, statusFilter, platformFilter]);

  const monthYearLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Page Header */}
      <PageHeader
        title="Marketing Calendar & Scheduling"
        description="Unified visual publishing calendar. Plan campaign timelines and auto-dispatch posts across all channels."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Calendar' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Link href="/create">
              <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Create Post
              </Button>
            </Link>
          </div>
        }
      />

      {/* Quick Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Upcoming Scheduled</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
              {stats.scheduled}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Published This Month</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
              {stats.published}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Failed / Retry</span>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
              {stats.failed}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Scheduling Timezone</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 flex items-center gap-1 font-mono">
              <Globe2 className="w-3.5 h-3.5 text-blue-500" />
              {APP_CONFIG.defaultTimezone}
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600">
            NPT +5:45
          </span>
        </div>
      </div>

      {/* Calendar Controls & View Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 min-w-[160px]">
            {monthYearLabel}
          </h3>

          <button
            onClick={goToToday}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'scheduled', 'published', 'failed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      {viewMode === 'month' && (
        <CalendarMonthView
          currentDate={currentDate}
          posts={filteredPosts}
          onSelectPost={(post) => setSelectedPost(post)}
          onSelectDate={(date) => {
            setShowScheduleModal(true);
          }}
        />
      )}

      {viewMode === 'week' && (
        <CalendarWeekView
          currentDate={currentDate}
          posts={filteredPosts}
          onSelectPost={(post) => setSelectedPost(post)}
          onSelectDate={(date) => {
            setShowScheduleModal(true);
          }}
        />
      )}

      {viewMode === 'list' && (
        <CalendarListView
          posts={filteredPosts}
          onSelectPost={(post) => setSelectedPost(post)}
        />
      )}

      {/* Post Details Modal */}
      <PostDetailsModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPublishNow={(id) => publishPost(id)}
      />

      {/* Schedule Post Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        platforms={['facebook', 'instagram', 'youtube']}
        postTitle="Campaign Post Schedule"
        onConfirmSchedule={async (scheduledDateTime, timezone) => {
          await createPost({
            title: 'New Scheduled Campaign',
            caption: 'Campaign scheduled directly via the Marketing Calendar.',
            hashtags: ['#socialhub', '#scheduled'],
            media: [],
            platforms: ['facebook', 'instagram', 'youtube'],
            status: 'scheduled',
            scheduledAt: scheduledDateTime,
            timezone,
          });
        }}
      />
    </div>
  );
}
