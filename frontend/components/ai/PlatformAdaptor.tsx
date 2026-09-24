'use client';

import React, { useState } from 'react';
import { aiService } from '@/services/ai.service';
import { PlatformAdaptationResult } from '@/types/ai';
import { SocialPlatform } from '@/types/social';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Sparkles, Copy, Check, ArrowRight, Wand2 } from 'lucide-react';
import Link from 'next/link';

export function PlatformAdaptor() {
  const [masterText, setMasterText] = useState(
    'We are excited to launch SocialHub 2.0 with omnichannel multi-platform publishing across Facebook, Instagram, TikTok, and YouTube. Creators can now draft once and schedule globally!'
  );
  const [adaptations, setAdaptations] = useState<PlatformAdaptationResult | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleAdapt = async () => {
    if (!masterText.trim()) return;
    setIsAdapting(true);
    try {
      const res = await aiService.adaptContentForPlatforms(masterText);
      setAdaptations(res);
    } finally {
      setIsAdapting(false);
    }
  };

  const copyPlatformText = (platform: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(platform);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const platformCards: { id: SocialPlatform; name: string; key: keyof PlatformAdaptationResult }[] = [
    { id: 'instagram', name: 'Instagram (Reels & Carousels)', key: 'instagram' },
    { id: 'facebook', name: 'Facebook (Feed & Community)', key: 'facebook' },
    { id: 'tiktok', name: 'TikTok (Fast Hook & Sound)', key: 'tiktok' },
    { id: 'youtube', name: 'YouTube (SEO Description & Shorts)', key: 'youtube' },
  ];

  return (
    <div className="space-y-6">
      {/* Master Content Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-600" />
            <span>Omnichannel Master Content Adaptor</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Write your core message once. Our AI model automatically adapts the tone, format, emojis, and hashtags for each social channel's algorithm.
          </p>
        </div>

        <Textarea
          rows={4}
          value={masterText}
          onChange={(e) => setMasterText(e.target.value)}
          placeholder="Enter your master announcement, press release, product update, or core marketing message..."
        />

        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleAdapt}
            isLoading={isAdapting}
            disabled={!masterText.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Adapt for All 4 Channels
          </Button>
        </div>
      </div>

      {/* Adapted Platform Variations */}
      {adaptations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platformCards.map((card) => {
            const text = adaptations[card.key];
            const isCopied = copiedKey === card.id;

            return (
              <div
                key={card.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <SocialPlatformIcon platform={card.id} size={16} />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {card.name}
                      </span>
                    </div>

                    <button
                      onClick={() => copyPlatformText(card.id, text)}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[140px]">
                    {text}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Link href="/create">
                    <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3 h-3" />}>
                      Compose Post
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
