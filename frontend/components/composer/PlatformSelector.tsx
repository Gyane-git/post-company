'use client';

import React from 'react';
import { SocialPlatform } from '@/types/social';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Check } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: SocialPlatform[];
  onTogglePlatform: (platform: SocialPlatform) => void;
  onSelectAll: () => void;
}

export function PlatformSelector({
  selectedPlatforms,
  onTogglePlatform,
  onSelectAll,
}: PlatformSelectorProps) {
  const platforms: { id: SocialPlatform; name: string; color: string; borderHover: string }[] = [
    { id: 'facebook', name: 'Facebook', color: '#1877F2', borderHover: 'hover:border-blue-400' },
    { id: 'instagram', name: 'Instagram', color: '#E4405F', borderHover: 'hover:border-pink-400' },
    { id: 'tiktok', name: 'TikTok', color: '#111827', borderHover: 'hover:border-slate-500' },
    { id: 'youtube', name: 'YouTube', color: '#FF0000', borderHover: 'hover:border-red-400' },
  ];

  const allSelected = platforms.every((p) => selectedPlatforms.includes(p.id));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Publish to Platforms ({selectedPlatforms.length})
        </label>
        <button
          type="button"
          onClick={onSelectAll}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {platforms.map((p) => {
          const isSelected = selectedPlatforms.includes(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onTogglePlatform(p.id)}
              className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-500 dark:bg-blue-950/40 dark:border-blue-500 shadow-xs'
                  : `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 ${p.borderHover}`
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ color: p.color }}>
                  <SocialPlatformIcon platform={p.id} size={18} />
                </span>
                <span
                  className={`text-xs font-semibold truncate ${
                    isSelected ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {p.name}
                </span>
              </div>

              <div
                className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-300 dark:border-slate-700'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
