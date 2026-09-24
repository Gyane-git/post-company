'use client';

import React, { useState } from 'react';
import { Smile, Trash2, Sparkles, Hash } from 'lucide-react';
import { SocialPlatform } from '@/types/social';
import { PLATFORM_CONFIGS } from '@/types/social';

interface CaptionEditorProps {
  caption: string;
  onChange: (val: string) => void;
  selectedPlatforms: SocialPlatform[];
  onOpenAiHelper?: () => void;
}

const COMMON_EMOJIS = ['🚀', '🔥', '✨', '💡', '📈', '🎯', '👇', '🙌', '🎉', '💯', '📱', '🎬'];

export function CaptionEditor({
  caption,
  onChange,
  selectedPlatforms,
  onOpenAiHelper,
}: CaptionEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Compute character limit based on most restrictive selected platform
  const limits = selectedPlatforms.map((p) => PLATFORM_CONFIGS[p]?.charLimit || 2200);
  const minLimit = limits.length > 0 ? Math.min(...limits) : 2200;
  const isOverLimit = caption.length > minLimit;

  const insertEmoji = (emoji: string) => {
    onChange(caption + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Post Caption
        </label>
        <div className="flex items-center gap-3">
          {caption.length > 0 && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs text-rose-500 hover:text-rose-600 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Clear
            </button>
          )}
          <span
            className={`text-xs font-mono font-medium ${
              isOverLimit ? 'text-rose-600 font-bold' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {caption.length} / {minLimit} chars
          </span>
        </div>
      </div>

      <div className="relative border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-xs">
        <textarea
          rows={5}
          value={caption}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your captivating post caption, hooks, calls to action, and stories..."
          className="w-full p-3.5 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-y min-h-[120px]"
        />

        {/* Toolbar */}
        <div className="px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-800/50 border-t border-slate-200/80 dark:border-slate-800 rounded-b-xl flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Emoji Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Insert emoji"
              >
                <Smile className="w-4 h-4" />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl grid grid-cols-6 gap-1 z-30 animate-in fade-in-50">
                  {COMMON_EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => insertEmoji(em)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-lg cursor-pointer"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Hashtag helper */}
            <button
              type="button"
              onClick={() => onChange(caption ? `${caption} #` : '#')}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Add #"
            >
              <Hash className="w-4 h-4" />
            </button>
          </div>

          {onOpenAiHelper && (
            <button
              type="button"
              onClick={onOpenAiHelper}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/60 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Polish</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
