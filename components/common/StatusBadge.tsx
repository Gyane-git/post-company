import React from 'react';
import { PostStatus } from '@/types/post';
import { CheckCircle2, Clock, FileText, AlertCircle, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: PostStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, size = 'md', showIcon = true, className = '' }: StatusBadgeProps) {
  const configs: Record<
    PostStatus,
    {
      label: string;
      styles: string;
      icon: React.ReactNode;
    }
  > = {
    published: {
      label: 'Published',
      styles: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
    },
    scheduled: {
      label: 'Scheduled',
      styles: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
      icon: <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
    },
    draft: {
      label: 'Draft',
      styles: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      icon: <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />,
    },
    failed: {
      label: 'Failed',
      styles: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
    },
    processing: {
      label: 'Publishing...',
      styles: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      icon: <Loader2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin" />,
    },
  };

  const config = configs[status] || configs.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.8'
      } ${config.styles} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
}
