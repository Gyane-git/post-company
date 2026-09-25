'use client';

import React from 'react';
import { Post } from '@/types/post';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Clock, Plus } from 'lucide-react';

interface CalendarWeekViewProps {
  currentDate: Date;
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onSelectDate: (date: Date) => void;
}

export function CalendarWeekView({
  currentDate,
  posts,
  onSelectPost,
  onSelectDate,
}: CalendarWeekViewProps) {
  // Get start of week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      date: d,
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      isToday: d.toDateString() === new Date().toDateString(),
    };
  });

  const getPostsForDay = (date: Date) => {
    const targetY = date.getFullYear();
    const targetM = date.getMonth();
    const targetD = date.getDate();
    return posts.filter((p) => {
      const targetTime = p.scheduledAt || p.publishedAt || p.createdAt;
      if (!targetTime) return false;
      const d = new Date(targetTime);
      return d.getFullYear() === targetY && d.getMonth() === targetM && d.getDate() === targetD;
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
        {weekDays.map((day) => {
          const dayPosts = getPostsForDay(day.date);

          return (
            <div
              key={day.name}
              className={`min-h-[350px] p-3 flex flex-col justify-between ${
                day.isToday ? 'bg-blue-50/20 dark:bg-blue-950/10' : ''
              }`}
            >
              <div>
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase">{day.name}</span>
                    <h4
                      className={`text-base font-bold flex items-center justify-center w-7 h-7 rounded-full mt-0.5 ${
                        day.isToday ? 'bg-blue-600 text-white' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {day.dayNumber}
                    </h4>
                  </div>
                  <button
                    onClick={() => onSelectDate(day.date)}
                    className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Schedule post on this day"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Day Posts List */}
                <div className="space-y-2">
                  {dayPosts.map((post) => {
                    const time = (post.scheduledAt || post.publishedAt || post.createdAt)
                      .split('T')[1]
                      ?.slice(0, 5);

                    return (
                      <div
                        key={post.id}
                        onClick={() => onSelectPost(post)}
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer shadow-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <StatusBadge status={post.status} size="sm" showIcon={false} />
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {time}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                          {post.title}
                        </p>

                        <div className="flex items-center gap-1">
                          {post.platforms.map((p) => (
                            <span key={p} className="text-slate-600 dark:text-slate-300">
                              <SocialPlatformIcon platform={p} size={13} />
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {dayPosts.length === 0 && (
                    <div className="py-8 text-center text-xs text-slate-400 font-medium">
                      No posts
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
