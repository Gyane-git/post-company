import { postsApi } from '@/lib/api/posts';
import { socialAccountsApi } from '@/lib/api/social-accounts';
import { mediaApi } from '@/lib/api/media';
import { adaptPostResponseToUi, uiPlatformToBackend, uiPostStatusToBackend } from '@/lib/adapters';
import { Post, PostCreateDto, PostFilterOptions } from '@/types/post';
import { DEFAULT_WORKSPACE_ID } from '@/lib/config';

export const postsService = {
  async getPosts(filter?: Partial<PostFilterOptions>, workspaceId: number = DEFAULT_WORKSPACE_ID): Promise<Post[]> {
    const queryParams = {
      workspaceId,
      status: filter?.status && filter.status !== 'all' ? uiPostStatusToBackend(filter.status) : undefined,
      platform: filter?.platform && filter.platform !== 'all' ? uiPlatformToBackend(filter.platform) : undefined,
      search: filter?.searchQuery?.trim() || undefined,
    };

    const rawPosts = await postsApi.getAll(queryParams);
    const posts = rawPosts.map(adaptPostResponseToUi);

    if (filter?.sortBy) {
      if (filter.sortBy === 'date-desc') {
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filter.sortBy === 'date-asc') {
        posts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (filter.sortBy === 'views-desc') {
        posts.sort((a, b) => (b.metrics?.views || 0) - (a.metrics?.views || 0));
      } else if (filter.sortBy === 'engagement-desc') {
        posts.sort((a, b) => (b.metrics?.engagementRate || 0) - (a.metrics?.engagementRate || 0));
      }
    } else {
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return posts;
  },

  async getPostById(id: string): Promise<Post | undefined> {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return undefined;

    try {
      const raw = await postsApi.getById(numId);
      return adaptPostResponseToUi(raw);
    } catch {
      return undefined;
    }
  },

  async createPost(dto: PostCreateDto, workspaceId: number = DEFAULT_WORKSPACE_ID): Promise<Post> {
    // 1. Resolve social account IDs for selected platforms
    const accounts = await socialAccountsApi.getByWorkspace(workspaceId);
    const socialAccountIds: number[] = [];

    dto.platforms.forEach((platform) => {
      const backendPlatform = uiPlatformToBackend(platform);
      const matched = accounts.find(
        (a) => a.platform.toLowerCase() === backendPlatform.toLowerCase()
      );
      if (matched) {
        socialAccountIds.push(matched.id);
      }
    });

    // 2. Handle media metadata if present
    let mediaId: number | null = null;
    if (dto.media && dto.media.length > 0) {
      const firstMedia = dto.media[0];
      const parsedMediaId = parseInt(firstMedia.id, 10);
      if (!isNaN(parsedMediaId) && parsedMediaId > 0) {
        mediaId = parsedMediaId;
      } else if (firstMedia.url) {
        try {
          const createdMedia = await mediaApi.create({
            workspaceId,
            fileName: firstMedia.filename || 'media-asset.jpg',
            fileUrl: firstMedia.url,
            mimeType: firstMedia.type === 'video' ? 'video/mp4' : 'image/jpeg',
            fileSize: firstMedia.sizeBytes || 1048576,
            duration: firstMedia.durationSec || null,
          });
          mediaId = createdMedia.id;
        } catch {
          // If media metadata fails to register, continue without failing post creation
        }
      }
    }

    // 3. Format scheduled date to UTC ISO string if applicable
    let scheduledAtUtc: string | null = null;
    if (dto.status === 'scheduled' && dto.scheduledAt) {
      scheduledAtUtc = new Date(dto.scheduledAt).toISOString();
    }

    const payload = {
      workspaceId,
      title: dto.title,
      caption: dto.caption,
      status: uiPostStatusToBackend(dto.status),
      mediaId,
      scheduledAt: scheduledAtUtc,
      socialAccountIds: socialAccountIds.length > 0 ? socialAccountIds : [1],
      hashtags: dto.hashtags,
    };

    const created = await postsApi.create(payload);
    return adaptPostResponseToUi(created);
  },

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('Invalid post ID');

    let socialAccountIds: number[] | undefined;
    if (updates.platforms && updates.platforms.length > 0) {
      const accounts = await socialAccountsApi.getByWorkspace(DEFAULT_WORKSPACE_ID);
      socialAccountIds = [];
      updates.platforms.forEach((platform) => {
        const backendPlatform = uiPlatformToBackend(platform);
        const matched = accounts.find(
          (a) => a.platform.toLowerCase() === backendPlatform.toLowerCase()
        );
        if (matched) socialAccountIds!.push(matched.id);
      });
    }

    let mediaId: number | null | undefined = undefined;
    if (updates.media) {
      if (updates.media.length > 0) {
        const parsed = parseInt(updates.media[0].id, 10);
        mediaId = !isNaN(parsed) && parsed > 0 ? parsed : null;
      } else {
        mediaId = null;
      }
    }

    const payload = {
      title: updates.title || '',
      caption: updates.caption || '',
      status: updates.status ? uiPostStatusToBackend(updates.status) : undefined,
      mediaId,
      scheduledAt: updates.scheduledAt ? new Date(updates.scheduledAt).toISOString() : undefined,
      socialAccountIds,
      hashtags: updates.hashtags,
    };

    const res = await postsApi.update(numId, payload);
    return adaptPostResponseToUi(res);
  },

  async deletePost(id: string): Promise<boolean> {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return false;
    return await postsApi.delete(numId);
  },

  async duplicatePost(id: string): Promise<Post> {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('Invalid post ID');
    const res = await postsApi.duplicate(numId);
    return adaptPostResponseToUi(res);
  },

  async publishPost(id: string): Promise<Post> {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('Invalid post ID');
    const res = await postsApi.publish(numId);
    return adaptPostResponseToUi(res);
  },

  async schedulePost(id: string, scheduledAt: string): Promise<Post> {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) throw new Error('Invalid post ID');
    const res = await postsApi.schedule(numId, {
      scheduledAt: new Date(scheduledAt).toISOString(),
    });
    return adaptPostResponseToUi(res);
  },
};
