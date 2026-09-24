'use client';

import React, { useState } from 'react';
import { SocialPlatform } from '@/types/social';
import { ContentLength, ContentTone } from '@/types/ai';
import { aiService } from '@/services/ai.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Sparkles, Copy, Check, RefreshCw, ArrowRight, CheckCheck } from 'lucide-react';
import Link from 'next/link';

export function CaptionGenerator() {
  const [topic, setTopic] = useState('New Product Launch & Automation Suite 2.0');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [tone, setTone] = useState<ContentTone>('professional');
  const [length, setLength] = useState<ContentLength>('medium');
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const result = await aiService.generateCaption({
        topic,
        platform,
        tone,
        length,
        includeHashtags: true,
        includeCallToAction: true,
      });
      setGeneratedCaption(result);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones: { id: ContentTone; label: string }[] = [
    { id: 'professional', label: 'Professional' },
    { id: 'friendly', label: 'Friendly' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'funny', label: 'Funny' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'sales', label: 'High Converting / Sales' },
  ];

  const lengths: { id: ContentLength; label: string }[] = [
    { id: 'short', label: 'Short (<50 words)' },
    { id: 'medium', label: 'Medium (100 words)' },
    { id: 'long', label: 'Longform Story' },
  ];

  const platforms: { id: SocialPlatform; label: string }[] = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings Form */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Caption Parameters</span>
        </h4>

        <div>
          <Input
            label="What is your content about?"
            placeholder="e.g. Announcing our 50% summer promotion for agency partners"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>

        {/* Platform Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Target Channel
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 justify-center font-medium transition-all cursor-pointer ${
                  platform === p.id
                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <SocialPlatformIcon platform={p.id} size={14} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Tone of Voice
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {tones.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  tone === t.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Length Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Caption Length
          </label>
          <div className="grid grid-cols-3 gap-2">
            {lengths.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLength(l.id)}
                className={`py-1.5 px-2 rounded-lg border text-xs text-center font-medium transition-all cursor-pointer ${
                  length === l.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            onClick={handleGenerate}
            isLoading={isGenerating}
            disabled={!topic.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Generate AI Caption
          </Button>
        </div>
      </div>

      {/* Result Card */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Generated Output
              </span>
              {generatedCaption && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 uppercase">
                  {platform} • {tone}
                </span>
              )}
            </div>

            {generatedCaption && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyResult}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-4">
            {generatedCaption ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed min-h-[220px]">
                {generatedCaption}
              </div>
            ) : (
              <div className="min-h-[220px] flex flex-col items-center justify-center p-6 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Sparkles className="w-8 h-8 mb-2 text-purple-400 opacity-60" />
                <p className="text-xs font-medium">Click "Generate AI Caption" to see the tailored draft</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                  Optimized for algorithm reach, organic hooks, and conversion CTAs.
                </p>
              </div>
            )}
          </div>
        </div>

        {generatedCaption && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={<RefreshCw className="w-3 h-3" />}
            >
              Regenerate
            </Button>

            <Link href="/create">
              <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Use in Composer
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
