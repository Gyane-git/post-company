'use client';

import React from 'react';
import { SocialAccount } from '@/types/account';
import { SocialPlatform } from '@/types/social';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Button } from '@/components/ui/Button';
import {
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  Users,
  Settings2,
  Power,
} from 'lucide-react';

interface SocialAccountCardProps {
  account: SocialAccount;
  isLoading?: boolean;
  onConnect: (platform: SocialPlatform) => void;
  onDisconnect: (platform: SocialPlatform) => void;
  onManage: (account: SocialAccount) => void;
}

export function SocialAccountCard({
  account,
  isLoading = false,
  onConnect,
  onDisconnect,
  onManage,
}: SocialAccountCardProps) {
  const isConnected = account.connected;

  const platformBrandStyles: Record<
    SocialPlatform,
    { border: string; bgAccent: string; color: string; desc: string }
  > = {
    facebook: {
      border: 'border-blue-200 dark:border-blue-900',
      bgAccent: 'bg-blue-50/50 dark:bg-blue-950/20',
      color: '#1877F2',
      desc: 'Connect Facebook Pages & Groups to publish video reels and track post reach.',
    },
    instagram: {
      border: 'border-pink-200 dark:border-pink-900',
      bgAccent: 'bg-pink-50/50 dark:bg-pink-950/20',
      color: '#E4405F',
      desc: 'Publish Instagram Feed posts, Reels, and Carousels with auto-hashtag tagging.',
    },
    tiktok: {
      border: 'border-slate-300 dark:border-slate-700',
      bgAccent: 'bg-slate-50 dark:bg-slate-850',
      color: '#111827',
      desc: 'Publish vertical short-form marketing videos directly to the TikTok For You feed.',
    },
    youtube: {
      border: 'border-red-200 dark:border-red-900',
      bgAccent: 'bg-red-50/50 dark:bg-red-950/20',
      color: '#FF0000',
      desc: 'Upload high-definition YouTube Shorts and standard video broadcasts.',
    },
  };

  const style = platformBrandStyles[account.platform];

  return (
    <div
      className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between ${
        isConnected ? 'border-slate-200/90 dark:border-slate-800' : 'border-dashed border-slate-300 dark:border-slate-700/80'
      }`}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-xs shrink-0"
              style={{ backgroundColor: `${style.color}15`, color: style.color }}
            >
              <SocialPlatformIcon platform={account.platform} size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 capitalize">
                {account.platform}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    <AlertCircle className="w-3.5 h-3.5" /> Not Connected
                  </span>
                )}
              </div>
            </div>
          </div>

          {isConnected && (
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {account.accountType || 'Channel'}
            </span>
          )}
        </div>

        {/* Profile Card if Connected */}
        {isConnected ? (
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={account.avatarUrl}
                alt={account.displayName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {account.displayName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  @{account.username}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center justify-end gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                {account.followersCount >= 1000
                  ? `${(account.followersCount / 1000).toFixed(1)}k`
                  : account.followersCount}
              </span>
              <span className="text-[10px] text-slate-400">Audience</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 p-3.5 bg-slate-50/50 dark:bg-slate-850/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {style.desc}
          </div>
        )}

        {/* Permissions & Connected status date */}
        {isConnected && account.connectedAt && (
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Connected {new Date(account.connectedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Token Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
        {isConnected ? (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onManage(account)}
              leftIcon={<Settings2 className="w-3.5 h-3.5" />}
              disabled={isLoading}
            >
              Manage
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDisconnect(account.platform)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              leftIcon={<Power className="w-3.5 h-3.5" />}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="primary"
            onClick={() => onConnect(account.platform)}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Connect Account
          </Button>
        )}
      </div>
    </div>
  );
}
