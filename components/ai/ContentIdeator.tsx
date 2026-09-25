'use client';

import React, { useState } from 'react';
import { ContentIdea } from '@/types/ai';
import { aiService } from '@/services/ai.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import { Lightbulb, Sparkles, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

export function ContentIdeator() {
  const [industry, setIndustry] = useState('Digital Marketing & SaaS');
  const [audience, setAudience] = useState('Startup Founders & Marketing Leads');
  const [goal, setGoal] = useState('Drive demo bookings and high-intent leads');
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const results = await aiService.generateIdeas({ industry, audience, goal });
      setIdeas(results);
    } finally {
      setIsGenerating(false);
    }
  };

  // Load initial sample ideas on first render
  React.useEffect(() => {
    let mounted = true;
    aiService.generateIdeas({ industry, audience, goal }).then((results) => {
      if (mounted) setIdeas(results);
    });
    return () => {
      mounted = false;
    };
  }, [industry, audience, goal]);

  return (
    <div className="space-y-6">
      {/* Parameter Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-purple-600" />
            <span>Content Brainstorming Engine</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Formulate high-velocity video hooks, case study angles, and carousels customized to your niche.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Industry / Sector"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <Input
            label="Target Audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
          <Input
            label="Campaign Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button
            size="sm"
            onClick={handleGenerate}
            isLoading={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Generate Campaign Ideas
          </Button>
        </div>
      </div>

      {/* Ideas Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => {
          const isSelected = selectedIdeaId === idea.id;

          return (
            <div
              key={idea.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4.5 shadow-xs flex flex-col justify-between transition-all ${
                isSelected
                  ? 'border-purple-600 ring-2 ring-purple-100 dark:ring-purple-950'
                  : 'border-slate-200/90 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-semibold">
                    <SocialPlatformIcon platform={idea.suggestedPlatform} size={12} />
                    <span className="capitalize">{idea.suggestedPlatform}</span>
                  </span>

                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    {idea.suggestedContentType}
                  </span>
                </div>

                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {idea.title}
                </h5>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {idea.description}
                </p>

                {idea.hook && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-[11px] italic text-slate-700 dark:text-slate-300">
                    <span className="font-semibold not-italic text-purple-600 dark:text-purple-400 block text-[10px]">
                      Recommended Opening Hook:
                    </span>
                    {idea.hook}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedIdeaId(idea.id)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium cursor-pointer"
                >
                  {isSelected ? 'Selected' : 'Save Idea'}
                </button>

                <Link href="/create">
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-xs h-8"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                  >
                    Use This Idea
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
