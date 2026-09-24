'use client';

import React, { useState } from 'react';
import { SocialPlatform } from '@/types/social';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialPlatformBadge } from '@/components/common/SocialPlatformBadge';
import { APP_CONFIG } from '@/config/app-config';
import { Calendar as CalendarIcon, Clock, Globe2, CheckCircle2 } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: SocialPlatform[];
  postTitle: string;
  onConfirmSchedule: (scheduledDateTime: string, timezone: string) => Promise<void>;
}

export function ScheduleModal({
  isOpen,
  onClose,
  platforms,
  postTitle,
  onConfirmSchedule,
}: ScheduleModalProps) {
  // Default to tomorrow 18:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('18:00');
  const [timezone, setTimezone] = useState(APP_CONFIG.defaultTimezone);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    setIsLoading(true);
    try {
      const scheduledDateTime = `${date}T${time}:00+05:45`;
      await onConfirmSchedule(scheduledDateTime, timezone);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Schedule Post"
      description="Choose the ideal publishing date, time, and timezone for your audience."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Post summary banner */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <p className="text-slate-500 font-medium">Post Title:</p>
          <p className="font-bold text-slate-900 dark:text-slate-100 truncate mt-0.5">
            {postTitle || 'Untitled Post'}
          </p>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {platforms.map((p) => (
              <SocialPlatformBadge key={p} platform={p} size="sm" />
            ))}
          </div>
        </div>

        {/* Date and Time inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="date"
            label="Publishing Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            leftIcon={<CalendarIcon className="w-4 h-4" />}
            required
          />

          <Input
            type="time"
            label="Publishing Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            leftIcon={<Clock className="w-4 h-4" />}
            required
          />
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Audience Timezone</span>
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="Asia/Kathmandu">Asia/Kathmandu (NPT, UTC+5:45) - Default</option>
            <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4:00)</option>
            <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
            <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+8:00)</option>
            <option value="America/New_York">America/New_York (EST, UTC-5:00)</option>
            <option value="Europe/London">Europe/London (GMT, UTC+0:00)</option>
          </select>
        </div>

        {/* Scheduling Summary Note */}
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <p>
            When scheduled, your post will automatically transition to <strong>Published</strong> at{' '}
            <strong>
              {date} {time} ({timezone})
            </strong>{' '}
            across all {platforms.length} connected channels.
          </p>
        </div>

        {/* Footer buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            Confirm Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
}
