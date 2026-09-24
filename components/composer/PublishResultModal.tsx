'use client';

import React, { useEffect, useState } from 'react';
import { SocialPlatform } from '@/types/social';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { CheckCircle2, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface PublishResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms: SocialPlatform[];
  postTitle: string;
}

interface StepStatus {
  platform: SocialPlatform;
  status: 'pending' | 'publishing' | 'success';
}

export function PublishResultModal({
  isOpen,
  onClose,
  platforms,
  postTitle,
}: PublishResultModalProps) {
  const [statuses, setStatuses] = useState<StepStatus[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setStatuses([]);
      setIsCompleted(false);
      return;
    }

    const initial = platforms.map((p) => ({ platform: p, status: 'pending' as const }));
    setStatuses(initial);

    // Simulate multi-platform sequential publishing
    platforms.forEach((p, idx) => {
      // Start publishing
      setTimeout(() => {
        setStatuses((prev) =>
          prev.map((item) => (item.platform === p ? { ...item, status: 'publishing' } : item))
        );
      }, idx * 450 + 100);

      // Finish publishing
      setTimeout(() => {
        setStatuses((prev) =>
          prev.map((item) => (item.platform === p ? { ...item, status: 'success' } : item))
        );
        if (idx === platforms.length - 1) {
          setIsCompleted(true);
        }
      }, (idx + 1) * 600 + 200);
    });
  }, [isOpen, platforms]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (isCompleted) onClose();
      }}
      size="md"
      title={isCompleted ? 'Published Successfully! 🎉' : 'Publishing Post...'}
      description={`"${postTitle.slice(0, 50)}..." is being dispatched across selected channels.`}
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-slate-400">
            {isCompleted ? 'All channels reported 200 OK' : 'Dispatching network payloads...'}
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
        {statuses.map((item) => (
          <div
            key={item.platform}
            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
              item.status === 'success'
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                : item.status === 'publishing'
                ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-xs">
                <SocialPlatformIcon platform={item.platform} size={18} />
              </span>
              <div>
                <p className="text-xs font-bold capitalize text-slate-900 dark:text-slate-100">
                  {item.platform}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.status === 'success'
                    ? 'Published to feed & timeline'
                    : item.status === 'publishing'
                    ? 'Uploading transcode & metadata...'
                    : 'Queued in pipeline'}
                </p>
              </div>
            </div>

            <div className="text-right">
              {item.status === 'success' && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success</span>
                </div>
              )}
              {item.status === 'publishing' && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </div>
              )}
              {item.status === 'pending' && (
                <span className="text-xs text-slate-400 font-mono">Waiting...</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
