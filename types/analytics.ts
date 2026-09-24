import { SocialPlatform } from './social';

export type DateRangePreset = '7d' | '30d' | '90d' | 'custom';

export interface OverviewMetrics {
  totalReach: number;
  reachChangePct: number;
  impressions: number;
  impressionsChangePct: number;
  engagement: number;
  engagementChangePct: number;
  likes: number;
  likesChangePct: number;
  comments: number;
  commentsChangePct: number;
  shares: number;
  sharesChangePct: number;
  videoViews: number;
  videoViewsChangePct: number;
  followers: number;
  followersChangePct: number;
}

export interface TimeSeriesPoint {
  date: string;
  reach: number;
  impressions: number;
  engagement: number;
  views: number;
  followers: number;
  postsPublished: number;
}

export interface PlatformMetrics {
  platform: SocialPlatform;
  displayName: string;
  followers: number;
  followersChange: number;
  reach: number;
  engagement: number;
  engagementRate: number;
  postsCount: number;
  views: number;
}

export interface TopPerformingPost {
  id: string;
  thumbnail: string;
  title: string;
  caption: string;
  platform: SocialPlatform;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  publishedAt: string;
}
