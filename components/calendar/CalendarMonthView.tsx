'use client';

import React from 'react';
import { Post } from '@/types/post';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Clock } from 'lucide-react';

interface CalendarMonthViewProps {
  currentDate: Date;
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onSelectDate: (date: Date) => void;
}

export function CalendarMonthView({
  currentDate,
  posts,
  onSelectPost,
  onSelectDate,
}: CalendarMonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: 42 }).map((_, index) => {
    const dayNumber = index - firstDayIndex + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const date = new Date(year, month, dayNumber);
      return {
        date,
        dayNumber,
        isCurrentMonth: true,
        isToday:
          new Date().toDateString() === date.toDateString(),
      };
    }
    return {
      date: null,
      dayNumber: null,
      isCurrentMonth: false,
      isToday: false,
    };
  });

  const getPostsForDay = (date: Date | null) => {
    if (!date) return [];
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

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      {/* Day header */}
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 text-center py-2.5">
        {dayNames.map((d) => (
          <span key={d} className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {d}
          </span>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-800/80">
        {daysArray.map((cell, idx) => {
          if (!cell.isCurrentMonth || !cell.date) {
            return (
              <div
                key={idx}
                className="min-h-[105px] sm:min-h-[125px] p-1.5 sm:p-2 bg-slate-50/30 dark:bg-slate-950/40"
              />
            );
          }

          const dayPosts = getPostsForDay(cell.date);

          return (
            <div
              key={idx}
              onClick={() => cell.date && onSelectDate(cell.date)}
              className={`min-h-[105px] sm:min-h-[125px] p-1.5 sm:p-2 transition-colors hover:bg-blue-50/20 dark:hover:bg-blue-950/10 cursor-pointer flex flex-col justify-between ${
                cell.isToday ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold flex items-center justify-center rounded-full w-6 h-6 ${
                    cell.isToday
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {dayPosts.length > 0 && (
                  <span className="text-[10px] font-mono text-slate-400 font-medium">
                    {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Day post cards */}
              <div className="mt-1 space-y-1 flex-1 overflow-y-auto max-h-24 scrollbar-none">
                {dayPosts.map((post) => {
                  const timeStr = (post.scheduledAt || post.publishedAt || post.createdAt)
                    .split('T')[1]
                    ?.slice(0, 5);

                  return (
                    <div
                      key={post.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPost(post);
                      }}
                      className={`p-1.5 rounded-lg border text-[11px] leading-tight transition-all truncate hover:shadow-xs ${
                        post.status === 'scheduled'
                          ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                          : post.status === 'published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-semibold truncate">
                        <div className="flex -space-x-1 shrink-0">
                          {post.platforms.map((p) => (
                            <span key={p} className="w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-xs">
                              <SocialPlatformIcon platform={p} size={9} />
                            </span>
                          ))}
                        </div>
                        <span className="truncate">{post.title}</span>
                      </div>
                      {timeStr && (
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{timeStr}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
