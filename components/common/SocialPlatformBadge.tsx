import React from 'react';
import { SocialPlatform } from '@/types/social';
import { SocialPlatformIcon } from './SocialPlatformIcon';

interface SocialPlatformBadgeProps {
  platform: SocialPlatform;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export function SocialPlatformBadge({
  platform,
  size = 'md',
  showLabel = true,
  className = '',
}: SocialPlatformBadgeProps) {
  const styles = {
    facebook: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
    instagram: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-900',
    tiktok: 'bg-slate-100 text-slate-900 border-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700',
    youtube: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
  };

  const labels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
  };

  const iconSizes = {
    sm: 13,
    md: 15,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${styles[platform]} ${className}`}
    >
      <SocialPlatformIcon platform={platform} size={iconSizes[size]} />
      {showLabel && <span>{labels[platform]}</span>}
    </span>
  );
}
