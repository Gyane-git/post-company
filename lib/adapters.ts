import {
  BackendPlatform,
  BackendPostStatus,
  BackendNotificationType,
  PostResponse,
  SocialAccountResponse,
  NotificationResponse,
  WorkspaceResponse,
} from '@/types/api';
import { SocialPlatform } from '@/types/social';
import { Post, PostMedia, PostStatus, PlatformPublishResult } from '@/types/post';
import { SocialAccount } from '@/types/account';
import { NotificationItem, NotificationType } from '@/types/notification';
import { Workspace } from '@/types/user';

// ----------------------------------------------------
// Platform Mappings
// ----------------------------------------------------

export function backendPlatformToUi(platform: string): SocialPlatform {
  const lower = platform.toLowerCase();
  if (lower === 'facebook') return 'facebook';
  if (lower === 'instagram') return 'instagram';
  if (lower === 'tiktok') return 'tiktok';
  if (lower === 'youtube') return 'youtube';
  return 'facebook';
}

export function uiPlatformToBackend(platform: SocialPlatform): BackendPlatform {
  switch (platform) {
    case 'facebook':
      return 'Facebook';
    case 'instagram':
      return 'Instagram';
    case 'tiktok':
      return 'TikTok';
    case 'youtube':
      return 'YouTube';
  }
}

// ----------------------------------------------------
// Status Mappings
// ----------------------------------------------------

export function backendPostStatusToUi(status: string): PostStatus {
  const lower = status.toLowerCase();
  if (lower === 'published') return 'published';
  if (lower === 'scheduled') return 'scheduled';
  if (lower === 'failed') return 'failed';
  if (lower === 'processing') return 'processing';
  return 'draft';
}

export function uiPostStatusToBackend(status: PostStatus): BackendPostStatus {
  switch (status) {
    case 'published':
      return 'Published';
    case 'scheduled':
      return 'Scheduled';
    case 'failed':
      return 'Failed';
    case 'processing':
      return 'Processing';
    case 'draft':
    default:
      return 'Draft';
  }
}

export function backendNotificationTypeToUi(type: BackendNotificationType | string): NotificationType {
  const lower = type.toLowerCase();
  if (lower === 'success') return 'publish_success';
  if (lower === 'error') return 'publish_failed';
  if (lower === 'warning') return 'account_alert';
  if (lower === 'info') return 'scheduled_reminder';
  return 'system';
}

// ----------------------------------------------------
// Post Adapters
// ----------------------------------------------------

export function adaptPostResponseToUi(dto: PostResponse): Post {
  const mediaList: PostMedia[] = [];

  if (dto.media) {
    mediaList.push({
      id: String(dto.media.id),
      type: dto.media.mimeType.startsWith('video') ? 'video' : 'image',
      url: dto.media.fileUrl,
      thumbnailUrl: dto.media.fileUrl,
      filename: dto.media.fileName,
      sizeBytes: dto.media.fileSize,
      durationSec: dto.media.duration ?? undefined,
      aspectRatio: '16:9',
    });
  }

  const platforms: SocialPlatform[] = dto.platforms.map((p) =>
    backendPlatformToUi(p.platform)
  );

  const publishResults: PlatformPublishResult[] = dto.platforms.map((p) => ({
    platform: backendPlatformToUi(p.platform),
    status: p.status === 'Published' ? 'success' : p.status === 'Failed' ? 'failed' : 'pending',
    publishedAt: p.publishedAt ?? undefined,
    errorMessage: p.errorMessage ?? undefined,
    externalPostUrl: p.externalPostId ? `https://${p.platform.toLowerCase()}.com/posts/${p.externalPostId}` : undefined,
  }));

  const isPublished = dto.status === 'Published';

  return {
    id: String(dto.id),
    title: dto.title,
    caption: dto.caption,
    hashtags: dto.hashtags || [],
    media: mediaList,
    platforms: platforms.length > 0 ? platforms : ['facebook'],
    status: backendPostStatusToUi(dto.status),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt || dto.createdAt,
    scheduledAt: dto.scheduledAt ?? undefined,
    publishedAt: dto.publishedAt ?? undefined,
    publishResults,
    metrics: isPublished
      ? {
          views: 1240,
          likes: 184,
          comments: 29,
          shares: 14,
          engagementRate: 4.8,
          reach: 2850,
          impressions: 4120,
        }
      : undefined,
    author: {
      id: 'usr-01',
      name: 'Gyanendra Shah',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
  };
}

// ----------------------------------------------------
// Social Account Adapters
// ----------------------------------------------------

export function adaptSocialAccountResponseToUi(dto: SocialAccountResponse): SocialAccount {
  const platform = backendPlatformToUi(dto.platform);

  const defaultFollowers: Record<SocialPlatform, number> = {
    facebook: 12540,
    instagram: 28350,
    tiktok: 44850,
    youtube: 8270,
  };

  return {
    id: String(dto.id),
    platform,
    username: dto.username,
    displayName: dto.displayName,
    avatarUrl:
      dto.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    connected: dto.isConnected,
    status: dto.isConnected ? 'connected' : 'disconnected',
    connectedAt: dto.connectedAt ?? undefined,
    followersCount: defaultFollowers[platform] || 10000,
    permissions: ['read', 'publish_content', 'read_insights'],
  };
}

// ----------------------------------------------------
// Notification Adapters
// ----------------------------------------------------

export function adaptNotificationResponseToUi(dto: NotificationResponse): NotificationItem {
  return {
    id: String(dto.id),
    type: backendNotificationTypeToUi(dto.type),
    title: dto.title,
    message: dto.message,
    createdAt: dto.createdAt,
    read: dto.isRead,
  };
}

// ----------------------------------------------------
// Workspace Adapters
// ----------------------------------------------------

export function adaptWorkspaceResponseToUi(dto: WorkspaceResponse): Workspace {
  return {
    id: String(dto.id),
    name: dto.name,
    slug: dto.slug,
    logo: dto.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    plan: 'Pro Enterprise',
    members: [
      {
        id: 'usr-01',
        name: 'Gyanendra Shah',
        email: 'gyanendra@devmind.io',
        role: 'Owner',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        status: 'active',
      },
    ],
  };
}
