'use client';

import React, { useState } from 'react';
import { X, Hash } from 'lucide-react';

interface HashtagInputProps {
  hashtags: string[];
  onChange: (tags: string[]) => void;
}

const PRESET_HASHTAGS = [
  '#digitalmarketing',
  '#nepal',
  '#business',
  '#socialmedia',
  '#growthhacking',
  '#videomarketing',
  '#devmind',
];

export function HashtagInput({ hashtags, onChange }: HashtagInputProps) {
  const [inputVal, setInputVal] = useState('');

  const addTag = (rawTag: string) => {
    let clean = rawTag.trim();
    if (!clean) return;
    if (!clean.startsWith('#')) {
      clean = `#${clean}`;
    }
    clean = clean.replace(/\s+/g, '');
    if (!hashtags.includes(clean)) {
      onChange([...hashtags, clean]);
    }
    setInputVal('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(hashtags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Hashtags ({hashtags.length})
        </label>
        {hashtags.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Input container */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent min-h-[44px]">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900 text-xs font-medium"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <div className="flex-1 min-w-[140px] flex items-center gap-1 px-1">
          <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => inputVal && addTag(inputVal)}
            placeholder="Type tag & press Enter..."
            className="w-full text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Suggested presets */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] text-slate-400">Suggested:</span>
        {PRESET_HASHTAGS.filter((p) => !hashtags.includes(p)).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => addTag(preset)}
            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            + {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
