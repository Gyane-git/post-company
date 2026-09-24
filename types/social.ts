export type SocialPlatform = 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export interface PlatformConfig {
  id: SocialPlatform;
  name: string;
  description: string;
  color: string;
  charLimit: number;
  hashtagLimit: number;
  videoMaxDurationSec: number;
  supportedRatios: string[];
}

export const PLATFORM_CONFIGS: Record<SocialPlatform, PlatformConfig> = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    description: 'Pages, Reels & Feed posts',
    color: '#1877F2',
    charLimit: 63206,
    hashtagLimit: 30,
    videoMaxDurationSec: 14400,
    supportedRatios: ['1:1', '4:5', '16:9', '9:16'],
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Feed, Reels & Carousels',
    color: '#E4405F',
    charLimit: 2200,
    hashtagLimit: 30,
    videoMaxDurationSec: 900,
    supportedRatios: ['1:1', '4:5', '9:16'],
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Vertical short-form video',
    color: '#000000',
    charLimit: 2200,
    hashtagLimit: 30,
    videoMaxDurationSec: 600,
    supportedRatios: ['9:16'],
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    description: 'Shorts & Standard video',
    color: '#FF0000',
    charLimit: 5000,
    hashtagLimit: 15,
    videoMaxDurationSec: 43200,
    supportedRatios: ['16:9', '9:16'],
  },
};
