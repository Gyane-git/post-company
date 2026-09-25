'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWorkspace } from '@/context/workspace-context';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Building2, Users, Plus, Shield, Check } from 'lucide-react';

export default function WorkspaceSettingsPage() {
  const { currentWorkspace, updateWorkspace } = useWorkspace();
  const [workspaceName, setWorkspaceName] = useState(currentWorkspace.name);
  const [workspaceSlug, setWorkspaceSlug] = useState(currentWorkspace.slug);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateWorkspace(currentWorkspace.id, {
        name: workspaceName,
        slug: workspaceSlug,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // error handled and toasted in context
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Configure organization profile, workspace plan, and invite marketing teammates."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings', href: '/settings' },
          { label: 'Workspace' },
        ]}
      />

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs font-semibold">
        <Link href="/settings/profile" className="pb-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          User Profile
        </Link>
        <Link href="/settings/workspace" className="pb-3 border-b-2 border-blue-600 text-blue-600 dark:text-blue-400">
          Workspace & Team
        </Link>
        <Link href="/settings/notifications" className="pb-3 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
          Notifications
        </Link>
      </div>

      {/* Workspace General */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Workspace Details</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Workspace Name"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />

          <Input
            label="Workspace URL Slug"
            value={workspaceSlug}
            onChange={(e) => setWorkspaceSlug(e.target.value)}
            helperText="socialhub.io/ws/devmind-media"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button
            size="sm"
            variant="primary"
            isLoading={isSaving}
            onClick={handleSave}
          >
            {saved ? 'Workspace Saved' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Team Members List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Team Members ({currentWorkspace.members.length})</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              People with publishing and analytics permissions in this workspace.
            </p>
          </div>

          <Button size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Invite Member
          </Button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 border-t border-slate-100 dark:border-slate-800">
          {currentWorkspace.members.map((member) => (
            <div key={member.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {member.role}
                </span>
                <span className="text-xs text-slate-400 font-medium">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
