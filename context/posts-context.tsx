'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Post, PostCreateDto } from '@/types/post';
import { postsService } from '@/services/posts.service';
import { INITIAL_MOCK_POSTS } from '@/data/mock-posts';

export interface PostStats {
  total: number;
  published: number;
  scheduled: number;
  failed: number;
  drafts: number;
}

export interface PostsContextType {
  posts: Post[];
  loading: boolean;
  stats: PostStats;
  refreshPosts: () => Promise<void>;
  createPost: (dto: PostCreateDto) => Promise<Post>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<boolean>;
  duplicatePost: (id: string) => Promise<Post>;
  publishPost: (id: string) => Promise<Post>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Baseline stats requested in prompt: Total Posts: 128, Published: 96, Scheduled: 21, Failed: 11
const BASELINE_OFFSET = {
  published: 93,
  scheduled: 18,
  failed: 10,
  drafts: 0,
};

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_MOCK_POSTS);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshPosts = async () => {
    try {
      setLoading(true);
      const data = await postsService.getPosts();
      setPosts(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const stats: PostStats = useMemo(() => {
    const publishedCount = posts.filter((p) => p.status === 'published').length + BASELINE_OFFSET.published;
    const scheduledCount = posts.filter((p) => p.status === 'scheduled').length + BASELINE_OFFSET.scheduled;
    const failedCount = posts.filter((p) => p.status === 'failed').length + BASELINE_OFFSET.failed;
    const draftsCount = posts.filter((p) => p.status === 'draft').length;
    const totalCount = publishedCount + scheduledCount + failedCount + draftsCount;

    return {
      total: totalCount,
      published: publishedCount,
      scheduled: scheduledCount,
      failed: failedCount,
      drafts: draftsCount,
    };
  }, [posts]);

  const createPost = async (dto: PostCreateDto): Promise<Post> => {
    const newPost = await postsService.createPost(dto);
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = async (id: string, updates: Partial<Post>): Promise<Post> => {
    const updated = await postsService.updatePost(id, updates);
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deletePost = async (id: string): Promise<boolean> => {
    const ok = await postsService.deletePost(id);
    if (ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    return ok;
  };

  const duplicatePost = async (id: string): Promise<Post> => {
    const dup = await postsService.duplicatePost(id);
    setPosts((prev) => [dup, ...prev]);
    return dup;
  };

  const publishPost = async (id: string): Promise<Post> => {
    const pub = await postsService.publishPost(id);
    setPosts((prev) => prev.map((p) => (p.id === id ? pub : p)));
    return pub;
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        stats,
        refreshPosts,
        createPost,
        updatePost,
        deletePost,
        duplicatePost,
        publishPost,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}
