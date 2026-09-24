'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWorkspace } from '@/context/workspace-context';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, User, Shield, Globe2, Check } from 'lucide-react';
import { APP_CONFIG } from '@/config/app-config';

export default function ProfileSettingsPage() {
  const { user } = useWorkspace();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);
  const [timezone, setTimezone] = useState(APP_CONFIG.defaultTimezone);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your account profile, workspace collaborators, and notification preferences."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings' },
          { label: 'Profile' },
        ]}
      />

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs font-semibold">
        <Link href="/settings/profile" className="pb-3 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400">
          User Profile
        </Link>
        <Link href="/settings/workspace" className="pb-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          Workspace & Team
        </Link>
        <Link href="/settings/notifications" className="pb-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          Notifications
        </Link>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800"
          />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</h4>
            <p className="text-xs text-slate-400 mt-0.5">{user.role} • DevMind Organization</p>
            <button
              type="button"
              className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Professional Bio
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Default Scheduling Timezone</span>
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="Asia/Kathmandu">Asia/Kathmandu (NPT, UTC+5:45) - Default</option>
            <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4:00)</option>
            <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
            <option value="America/New_York">America/New_York (EST, UTC-5:00)</option>
            <option value="Europe/London">Europe/London (GMT, UTC+0:00)</option>
          </select>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button
            type="submit"
            size="sm"
            variant="primary"
            leftIcon={saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          >
            {saved ? 'Changes Saved' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
