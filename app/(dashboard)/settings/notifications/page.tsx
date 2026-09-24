'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Bell, Check, Mail, Smartphone } from 'lucide-react';

export default function NotificationSettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [publishingSuccess, setPublishingSuccess] = useState(true);
  const [publishingFailures, setPublishingFailures] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [engagementMilestones, setEngagementMilestones] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Choose which publishing triggers and performance milestones notify your team."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings' },
          { label: 'Notifications' },
        ]}
      />

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs font-semibold">
        <Link href="/settings/profile" className="pb-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          User Profile
        </Link>
        <Link href="/settings/workspace" className="pb-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          Workspace & Team
        </Link>
        <Link href="/settings/notifications" className="pb-3 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400">
          Notifications
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Publishing & Activity Alerts</span>
          </h4>

          <div className="space-y-3.5">
            <label className="flex items-start justify-between cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Publishing Failures & Token Expirations
                </p>
                <p className="text-[11px] text-slate-400">
                  Immediate alerts when a post fails to dispatch on TikTok, YouTube, Facebook or Instagram.
                </p>
              </div>
              <input
                type="checkbox"
                checked={publishingFailures}
                onChange={(e) => setPublishingFailures(e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-start justify-between cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Successful Multi-channel Dispatches
                </p>
                <p className="text-[11px] text-slate-400">
                  Receive confirmation when scheduled posts go live across all networks.
                </p>
              </div>
              <input
                type="checkbox"
                checked={publishingSuccess}
                onChange={(e) => setPublishingSuccess(e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-start justify-between cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Engagement & Viral Milestones
                </p>
                <p className="text-[11px] text-slate-400">
                  Notify me when a reel, video, or post exceeds 25,000 views or 10% engagement rate.
                </p>
              </div>
              <input
                type="checkbox"
                checked={engagementMilestones}
                onChange={(e) => setEngagementMilestones(e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>

            <label className="flex items-start justify-between cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Weekly Analytics Digest
                </p>
                <p className="text-[11px] text-slate-400">
                  A high-level weekly summary email detailing audience growth and top creative performers.
                </p>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
          >
            {saved ? 'Preferences Saved' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
