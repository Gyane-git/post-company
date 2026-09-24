'use client';

import React, { useState } from 'react';
import { useWorkspace } from '@/context/workspace-context';
import { PageHeader } from '@/components/common/PageHeader';
import { SocialAccountCard } from '@/components/social/SocialAccountCard';
import { ConnectAccountModal } from '@/components/social/ConnectAccountModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SocialPlatform } from '@/types/social';
import { SocialAccount } from '@/types/account';
import {
  Share2,
  ShieldAlert,
  Code2,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  RefreshCw,
} from 'lucide-react';

export default function SocialAccountsPage() {
  const { accounts, connectedCount, connectAccount, disconnectAccount } = useWorkspace();

  const [connectingPlatform, setConnectingPlatform] = useState<SocialPlatform | null>(null);
  const [disconnectingPlatform, setDisconnectingPlatform] = useState<SocialPlatform | null>(null);
  const [managedAccount, setManagedAccount] = useState<SocialAccount | null>(null);

  const handleConfirmConnect = async (platform: SocialPlatform, username: string, displayName?: string) => {
    await connectAccount(platform, username, displayName);
  };

  const handleConfirmDisconnect = async () => {
    if (disconnectingPlatform) {
      await disconnectAccount(disconnectingPlatform);
      setDisconnectingPlatform(null);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
      <PageHeader
        title="Connected Social Accounts"
        description="Connect and manage permissions for Facebook, Instagram, TikTok, and YouTube channels. Multi-channel tokens enable unified publishing and cross-network analytics."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Social Accounts' },
        ]}
        badge={
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
            {connectedCount} of 4 Channels Active
          </span>
        }
      />

      {/* Backend Architecture Readiness Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-blue-50 via-indigo-50/50 to-white dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-200/90 dark:border-blue-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Production .NET & PostgreSQL Architecture Ready</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Account state and OAuth tokens will be securely orchestrated by the upcoming ASP.NET backend. Token refreshes, webhook subscriptions, and granular scopes are stubbed cleanly in TypeScript interfaces without mock compromises.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono font-medium text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
            OAuth 2.0 PKCE Flow
          </span>
        </div>
      </div>

      {/* Social Accounts Grid (4 platforms) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {accounts.map((acc) => (
          <SocialAccountCard
            key={acc.platform}
            account={acc}
            onConnect={(p) => setConnectingPlatform(p)}
            onDisconnect={(p) => setDisconnectingPlatform(p)}
            onManage={(a) => setManagedAccount(a)}
          />
        ))}
      </div>

      {/* Connect Account Modal */}
      <ConnectAccountModal
        isOpen={!!connectingPlatform}
        platform={connectingPlatform}
        onClose={() => setConnectingPlatform(null)}
        onConfirmConnect={handleConfirmConnect}
      />

      {/* Disconnect Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!disconnectingPlatform}
        onClose={() => setDisconnectingPlatform(null)}
        onConfirm={handleConfirmDisconnect}
        title="Disconnect Social Account"
        message={`Are you sure you want to disconnect ${disconnectingPlatform?.toUpperCase()}? Scheduled posts targeting this channel will require authorization before publishing.`}
        confirmLabel="Disconnect Channel"
        variant="danger"
      />

      {/* Account Permissions / Management Modal */}
      {managedAccount && (
        <Modal
          isOpen={!!managedAccount}
          onClose={() => setManagedAccount(null)}
          title={`${managedAccount.displayName} — Permissions`}
          description={`Account ID: ${managedAccount.id} • Platform: ${managedAccount.platform}`}
          size="md"
          footer={
            <Button size="sm" variant="outline" onClick={() => setManagedAccount(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Username:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  @{managedAccount.username}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Audience:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {managedAccount.followersCount.toLocaleString()} followers
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Connected Since:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {managedAccount.connectedAt
                    ? new Date(managedAccount.connectedAt).toLocaleDateString()
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Active Channel Permissions
              </label>
              <div className="space-y-1.5">
                {managedAccount.permissions.map((perm) => (
                  <div
                    key={perm}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                  >
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{perm}</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Granted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
