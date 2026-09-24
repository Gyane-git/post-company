import { SocialPlatform } from './social';

export type PostStatus = 'published' | 'scheduled' | 'draft' | 'failed' | 'processing';

export interface PostMedia {
  id: string;
  type: 'video' | 'image';
  url: string;
  thumbnailUrl: string;
  filename: string;
  sizeBytes: number;
  durationSec?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
}

export interface PostMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number; // percentage, e.g. 4.8
  reach?: number;
  impressions?: number;
}

export interface PlatformPublishResult {
  platform: SocialPlatform;
  status: 'success' | 'failed' | 'pending';
  publishedAt?: string;
  externalPostUrl?: string;
  errorMessage?: string;
}

export interface Post {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  media: PostMedia[];
  platforms: SocialPlatform[];
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  publishedAt?: string;
  metrics?: PostMetrics;
  publishResults?: PlatformPublishResult[];
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface PostCreateDto {
  title: string;
  caption: string;
  hashtags: string[];
  media: PostMedia[];
  platforms: SocialPlatform[];
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt?: string;
  timezone?: string;
}

export interface PostFilterOptions {
  searchQuery: string;
  status: PostStatus | 'all';
  platform: SocialPlatform | 'all';
  sortBy: 'date-desc' | 'date-asc' | 'views-desc' | 'engagement-desc';
}
