'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { AiChat } from '@/components/ai/AiChat';
import { CaptionGenerator } from '@/components/ai/CaptionGenerator';
import { HashtagGenerator } from '@/components/ai/HashtagGenerator';
import { ContentIdeator } from '@/components/ai/ContentIdeator';
import { PlatformAdaptor } from '@/components/ai/PlatformAdaptor';
import { Tabs } from '@/components/ui/Tabs';
import {
  Sparkles,
  MessageSquare,
  FileText,
  Hash,
  Lightbulb,
  Wand2,
  Info,
} from 'lucide-react';

export default function AiAssistantPage() {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'Copilot Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'caption', label: 'Caption Generator', icon: <FileText className="w-4 h-4" /> },
    { id: 'hashtags', label: 'Hashtag Clusters', icon: <Hash className="w-4 h-4" /> },
    { id: 'ideas', label: 'Content Ideas', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'adaptor', label: 'Omnichannel Adaptor', icon: <Wand2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Page Header */}
      <PageHeader
        title="AI Marketing Assistant"
        description="Generative marketing copilot designed to engineer high-retention video hooks, hashtags, and multi-network platform adaptations."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'AI Assistant' },
        ]}
        badge={
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Marketing Tuned Model</span>
          </span>
        }
      />

      {/* Tabs Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2 shadow-xs">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pills"
        />
      </div>

      {/* Tab Panels */}
      {activeTab === 'chat' && <AiChat />}
      {activeTab === 'caption' && <CaptionGenerator />}
      {activeTab === 'hashtags' && <HashtagGenerator />}
      {activeTab === 'ideas' && <ContentIdeator />}
      {activeTab === 'adaptor' && <PlatformAdaptor />}
    </div>
  );
}
