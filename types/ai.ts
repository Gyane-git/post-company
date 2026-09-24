import { SocialPlatform } from './social';

export type ContentTone = 'professional' | 'friendly' | 'luxury' | 'funny' | 'minimal' | 'sales';
export type ContentLength = 'short' | 'medium' | 'long';

export interface CaptionGenerationPrompt {
  topic: string;
  platform: SocialPlatform;
  tone: ContentTone;
  length: ContentLength;
  includeHashtags: boolean;
  includeCallToAction: boolean;
}

export interface HashtagGenerationPrompt {
  topic: string;
  platform: SocialPlatform;
  count: number;
}

export interface ContentIdeaPrompt {
  industry: string;
  audience: string;
  goal: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  suggestedPlatform: SocialPlatform;
  suggestedContentType: 'Reel/Short' | 'Carousel' | 'Educational Video' | 'Behind the Scenes' | 'Announcement';
  hook: string;
}

export interface PlatformAdaptationResult {
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
}
