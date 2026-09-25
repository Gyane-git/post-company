'use client';

import React, { useEffect, useState } from 'react';
import { SocialPlatform } from '@/types/social';
import { PlatformPublishResult } from '@/types/post';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PublishResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: SocialPlatform[];
  postTitle: string;
  results?: PlatformPublishResult[];
}

export function PublishResultModal({
  isOpen,
  onClose,
  platforms,
  postTitle,
  results,
}: PublishResultModalProps) {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Brief simulation of backend multi-network dispatch
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const isCompleted = !isProcessing;

  const getPlatformStatus = (platform: SocialPlatform) => {
    if (results && results.length > 0) {
      const match = results.find((r) => r.platform === platform);
      if (match) return match.status;
    }
    return isCompleted ? 'success' : 'pending';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (isCompleted) onClose();
      }}
      size="md"
      title={isCompleted ? 'Published Successfully! 🎉' : 'Publishing to Channels...'}
      description={`"${postTitle.slice(0, 50)}..." is being processed by the backend mock publishing service.`}
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-400">
            {isCompleted ? 'All channels processed by API' : 'Dispatching network payloads...'}
          </span>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <>
                <Button size="sm" variant="outline" onClick={onClose}>
                  Create Another
                </Button>
                <Link href="/content">
                  <Button size="sm" variant="primary">
                    View in Content Library
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-3 py-2">
        {platforms.map((platform) => {
          const status = getPlatformStatus(platform);

          return (
            <div
              key={platform}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                status === 'success'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  : status === 'failed'
                  ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  : 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                  <SocialPlatformIcon platform={platform} size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold capitalize text-slate-900 dark:text-slate-100">
                    {platform}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {status === 'success'
                      ? 'Mock publish succeeded'
                      : status === 'failed'
                      ? 'Publish failed on this channel'
                      : 'Sending request to backend...'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {status === 'success' && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Published</span>
                  </div>
                )}
                {status === 'failed' && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Failed</span>
                  </div>
                )}
                {status === 'pending' && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
