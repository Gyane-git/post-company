'use client';

import React, { useState } from 'react';
import { SocialPlatform } from '@/types/social';
import { aiService } from '@/services/ai.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Hash, Sparkles, Copy, Check } from 'lucide-react';

export function HashtagGenerator() {
  const [topic, setTopic] = useState('Digital Marketing agency in Nepal');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [count, setCount] = useState(10);
  const [tags, setTags] = useState<string[]>([
    '#digitalmarketing',
    '#nepalmarketing',
    '#socialmediatips',
    '#growthhacking',
    '#kathmandubusiness',
    '#brandstrategy',
    '#devmind',
    '#contentcreator',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const result = await aiService.generateHashtags({ topic, platform, count });
      setTags(result);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(tags.join(' '));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Hash className="w-4 h-4 text-purple-600" />
            <span>AI Hashtag Cluster Generator</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Target high-intent niche and trending discovery tags without spamming.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <Input
            label="Campaign Focus / Niche Topic"
            placeholder="e.g. Kathmandu creative design agency or B2B SaaS startup"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Hashtag Count
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value={5}>5 Minimal Tags</option>
            <option value={10}>10 Recommended Tags</option>
            <option value={15}>15 High Discovery Tags</option>
            <option value={20}>20 Maximum Cluster Tags</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          size="sm"
          onClick={handleGenerate}
          isLoading={isGenerating}
          disabled={!topic.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white"
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Generate Tags
        </Button>

        {tags.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={copyAll}
            leftIcon={copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedAll ? 'Copied All to Clipboard' : 'Copy All Tags'}
          </Button>
        )}
      </div>

      {/* Tags Cloud */}
      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-purple-700 dark:text-purple-300 shadow-xs flex items-center gap-1.5"
          >
            <Hash className="w-3 h-3 text-purple-400" />
            <span>{tag.replace('#', '')}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
