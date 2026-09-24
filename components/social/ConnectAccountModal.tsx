'use client';

import React, { useState } from 'react';
import { SocialPlatform } from '@/types/social';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Info, Key, CheckCircle2, ArrowRight } from 'lucide-react';

interface ConnectAccountModalProps {
  isOpen: boolean;
  platform: SocialPlatform | null;
  onClose: () => void;
  onConfirmConnect: (platform: SocialPlatform, username: string, displayName?: string) => Promise<void>;
}

export function ConnectAccountModal({
  isOpen,
  platform,
  onClose,
  onConfirmConnect,
}: ConnectAccountModalProps) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  if (!platform) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      await onConfirmConnect(platform, username, displayName || username);
      onClose();
      setUsername('');
      setDisplayName('');
      setActiveStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const platformNames: Record<SocialPlatform, string> = {
    facebook: 'Facebook Pages & Groups',
    instagram: 'Instagram Professional Account',
    tiktok: 'TikTok Creator / Business Account',
    youtube: 'YouTube Brand Channel',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={`Connect ${platform.toUpperCase()}`}
      description="Simulated OAuth 2.0 Authorization Flow"
    >
      <form onSubmit={handleConnect} className="space-y-5">
        {/* Architect Note Banner */}
        <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Frontend Architecture Notice</span>
          </div>
          <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300">
            Real OAuth redirect handlers will be processed by the forthcoming ASP.NET Core API at{' '}
            <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded font-mono">
              /api/auth/{platform}/callback
            </code>
            . Use this form to test UI connection state and local publishing workflows.
          </p>
        </div>

        {/* Selected Platform Banner */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <SocialPlatformIcon platform={platform} size={22} />
          </span>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
              {platformNames[platform]}
            </h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Will grant permissions for post publishing, media upload, and analytics retrieval.
            </p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          <Input
            label="Account Handle / Username"
            placeholder={platform === 'instagram' ? 'e.g. devmindofficial' : 'e.g. devmind_growth'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            helperText="Enter a realistic mock username to display in the UI"
          />

          <Input
            label="Display / Organization Name (Optional)"
            placeholder="e.g. DevMind Official"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        {/* Requested Scopes */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Simulated Scopes & Permissions
          </label>
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Read channel profile and follower metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Publish videos, reels, and captions on your behalf</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Fetch real-time video view and engagement webhooks</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            disabled={!username.trim()}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Authorize & Connect
          </Button>
        </div>
      </form>
    </Modal>
  );
}
