import { INITIAL_MOCK_POSTS } from '@/data/mock-posts';
import { Post, PostCreateDto, PostFilterOptions, PlatformPublishResult } from '@/types/post';

/**
 * Posts Service
 * Encapsulates posts retrieval, creation, updating, and simulated multi-platform publishing.
 * Designed so that when the .NET backend API is ready, methods can directly invoke HttpClient endpoints.
 */

// In-memory working copy initialized from mock data
let mockPostsDatabase: Post[] = [...INITIAL_MOCK_POSTS];

export const postsService = {
  async getPosts(filter?: Partial<PostFilterOptions>): Promise<Post[]> {
    // Simulate slight network resolution
    await new Promise((r) => setTimeout(r, 80));

    let result = [...mockPostsDatabase];

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((p) => p.status === filter.status);
    }

    if (filter?.platform && filter.platform !== 'all') {
      const targetPlatform = filter.platform;
      result = result.filter((p) => p.platforms.includes(targetPlatform));
    }

    if (filter?.searchQuery?.trim()) {
      const q = filter.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.caption.toLowerCase().includes(q) ||
          p.hashtags.some((h) => h.toLowerCase().includes(q))
      );
    }

    if (filter?.sortBy) {
      if (filter.sortBy === 'date-desc') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filter.sortBy === 'date-asc') {
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (filter.sortBy === 'views-desc') {
        result.sort((a, b) => (b.metrics?.views || 0) - (a.metrics?.views || 0));
      } else if (filter.sortBy === 'engagement-desc') {
        result.sort((a, b) => (b.metrics?.engagementRate || 0) - (a.metrics?.engagementRate || 0));
      }
    } else {
      // Default: newest first
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  },

  async getPostById(id: string): Promise<Post | undefined> {
    await new Promise((r) => setTimeout(r, 60));
    return mockPostsDatabase.find((p) => p.id === id);
  },

  async createPost(dto: PostCreateDto): Promise<Post> {
    await new Promise((r) => setTimeout(r, 120));
    const now = new Date().toISOString();

    const publishResults: PlatformPublishResult[] = dto.platforms.map((platform) => ({
      platform,
      status: dto.status === 'published' ? 'success' : 'pending',
      publishedAt: dto.status === 'published' ? now : undefined,
    }));

    const newPost: Post = {
      id: `post-${Date.now().toString().slice(-6)}`,
      title: dto.title || (dto.caption.slice(0, 40) + '...'),
      caption: dto.caption,
      hashtags: dto.hashtags,
      media: dto.media,
      platforms: dto.platforms,
      status: dto.status,
      createdAt: now,
      updatedAt: now,
      scheduledAt: dto.status === 'scheduled' ? dto.scheduledAt : undefined,
      publishedAt: dto.status === 'published' ? now : undefined,
      publishResults: dto.status === 'published' ? publishResults : undefined,
      metrics:
        dto.status === 'published'
          ? {
              views: 124,
              likes: 18,
              comments: 3,
              shares: 2,
              engagementRate: 5.4,
              reach: 240,
              impressions: 310,
            }
          : undefined,
      author: {
        id: 'usr-01',
        name: 'Gyanendra Shah',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      },
    };

    mockPostsDatabase = [newPost, ...mockPostsDatabase];
    return newPost;
  },

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    await new Promise((r) => setTimeout(r, 100));
    const index = mockPostsDatabase.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Post ${id} not found`);
    }

    const updated = {
      ...mockPostsDatabase[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockPostsDatabase[index] = updated;
    return updated;
  },

  async deletePost(id: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 80));
    const initialLen = mockPostsDatabase.length;
    mockPostsDatabase = mockPostsDatabase.filter((p) => p.id !== id);
    return mockPostsDatabase.length < initialLen;
  },

  async duplicatePost(id: string): Promise<Post> {
    await new Promise((r) => setTimeout(r, 100));
    const target = mockPostsDatabase.find((p) => p.id === id);
    if (!target) throw new Error(`Post ${id} not found`);

    const now = new Date().toISOString();
    const duplicated: Post = {
      ...target,
      id: `post-${Date.now().toString().slice(-6)}`,
      title: `${target.title} (Copy)`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      scheduledAt: undefined,
      publishedAt: undefined,
      metrics: undefined,
      publishResults: undefined,
    };

    mockPostsDatabase = [duplicated, ...mockPostsDatabase];
    return duplicated;
  },

  async publishPost(id: string): Promise<Post> {
    await new Promise((r) => setTimeout(r, 150));
    const target = mockPostsDatabase.find((p) => p.id === id);
    if (!target) throw new Error(`Post ${id} not found`);

    const now = new Date().toISOString();
    const publishResults: PlatformPublishResult[] = target.platforms.map((platform) => ({
      platform,
      status: 'success',
      publishedAt: now,
    }));

    const updated: Post = {
      ...target,
      status: 'published',
      publishedAt: now,
      updatedAt: now,
      publishResults,
      metrics: target.metrics || {
        views: 45,
        likes: 7,
        comments: 1,
        shares: 0,
        engagementRate: 3.8,
        reach: 90,
        impressions: 110,
      },
    };

    const index = mockPostsDatabase.findIndex((p) => p.id === id);
    mockPostsDatabase[index] = updated;
    return updated;
  },
};
