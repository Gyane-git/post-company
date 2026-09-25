/**
 * Backend API Data Transfer Objects (DTOs)
 * Strictly aligned with ASP.NET Core 8 Web API models
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[];
}

// ----------------------------------------------------
// Constants & Enums
// ----------------------------------------------------

export type BackendPlatform = 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube';

export type BackendPostStatus =
  | 'Draft'
  | 'Processing'
  | 'Published'
  | 'Scheduled'
  | 'Failed';

export type BackendPlatformStatus =
  | 'Pending'
  | 'Processing'
  | 'Published'
  | 'Failed';

export type BackendNotificationType =
  | 'Info'
  | 'Success'
  | 'Warning'
  | 'Error';

// ----------------------------------------------------
// Workspace DTOs
// ----------------------------------------------------

export interface WorkspaceResponse {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
}

export interface UpdateWorkspaceRequest {
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  isActive?: boolean;
}

// ----------------------------------------------------
// User DTOs
// ----------------------------------------------------

export interface UserResponse {
  id: number;
  workspaceId: number | null;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  workspaceId?: number | null;
}

export interface UpdateUserRequest {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  workspaceId?: number | null;
}

// ----------------------------------------------------
// Social Account DTOs
// ----------------------------------------------------

export interface SocialAccountResponse {
  id: number;
  workspaceId: number;
  platform: BackendPlatform;
  platformAccountId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isConnected: boolean;
  tokenExpiresAt: string | null;
  connectedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateSocialAccountRequest {
  workspaceId: number;
  platform: BackendPlatform;
  platformAccountId: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
}

export interface UpdateSocialAccountRequest {
  username: string;
  displayName: string;
  avatarUrl?: string | null;
}

// ----------------------------------------------------
// Media DTOs
// ----------------------------------------------------

export interface MediaResponse {
  id: number;
  workspaceId: number;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  duration: number | null;
  createdAt: string;
}

export interface CreateMediaRequest {
  workspaceId: number;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  duration?: number | null;
}

export interface UpdateMediaRequest {
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  duration?: number | null;
}

// ----------------------------------------------------
// Hashtags DTOs
// ----------------------------------------------------

export interface HashtagResponse {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateHashtagRequest {
  name: string;
}

// ----------------------------------------------------
// Notifications DTOs
// ----------------------------------------------------

export interface NotificationResponse {
  id: number;
  workspaceId: number;
  title: string;
  message: string;
  type: BackendNotificationType;
  isRead: boolean;
  createdAt: string;
}

// ----------------------------------------------------
// Posts DTOs
// ----------------------------------------------------

export interface PostPlatformResponse {
  id: number;
  postId: number;
  socialAccountId: number;
  platform: BackendPlatform;
  status: BackendPlatformStatus;
  externalPostId: string | null;
  errorMessage: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface PostResponse {
  id: number;
  workspaceId: number;
  title: string;
  caption: string;
  status: BackendPostStatus;
  mediaId: number | null;
  media: MediaResponse | null;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  platforms: PostPlatformResponse[];
  hashtags: string[];
}

export interface CreatePostRequest {
  workspaceId: number;
  title: string;
  caption: string;
  status?: BackendPostStatus;
  mediaId?: number | null;
  scheduledAt?: string | null;
  socialAccountIds?: number[];
  hashtags?: string[];
}

export interface UpdatePostRequest {
  title: string;
  caption: string;
  status?: BackendPostStatus;
  mediaId?: number | null;
  scheduledAt?: string | null;
  socialAccountIds?: number[];
  hashtags?: string[];
}

export interface SchedulePostRequest {
  scheduledAt: string;
}

export interface PostQueryParameters {
  workspaceId?: number;
  status?: string;
  platform?: string;
  search?: string;
}

// ----------------------------------------------------
// Analytics DTOs
// ----------------------------------------------------

export interface AnalyticsSnapshotResponse {
  id: number;
  socialAccountId: number;
  platform: BackendPlatform | null;
  username: string | null;
  date: string;
  followers: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagementRate: number;
  createdAt: string;
}

export interface PlatformMetricsResponse {
  platform: BackendPlatform;
  followers: number;
  reach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  engagement: number;
  views: number;
  averageEngagementRate: number;
}

export interface AnalyticsSummaryResponse {
  workspaceId: number;
  totalFollowers: number;
  totalReach: number;
  totalImpressions: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalEngagement: number;
  totalViews: number;
  averageEngagementRate: number;
  byPlatform: PlatformMetricsResponse[];
}

// ----------------------------------------------------
// Dashboard Summary DTO
// ----------------------------------------------------

export interface DashboardSummaryResponse {
  workspaceId: number;
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  failedPosts: number;
  connectedAccounts: number;
  totalReach: number;
  totalImpressions: number;
  totalEngagement: number;
  totalViews: number;
  recentPosts: PostResponse[];
  recentNotifications: NotificationResponse[];
}
