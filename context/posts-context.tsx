'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Post, PostCreateDto } from '@/types/post';
import { postsService } from '@/services/posts.service';
import { useToast } from '@/context/toast-context';
import { useWorkspace } from '@/context/workspace-context';
import { parseApiError } from '@/lib/api/client';

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
  error: string | null;
  stats: PostStats;
  refreshPosts: () => Promise<void>;
  createPost: (dto: PostCreateDto) => Promise<Post>;
  updatePost: (id: string, updates: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<boolean>;
  duplicatePost: (id: string) => Promise<Post>;
  publishPost: (id: string) => Promise<Post>;
  schedulePost: (id: string, scheduledAt: string) => Promise<Post>;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = Number(currentWorkspace.id) || 1;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const refreshPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsService.getPosts(undefined, workspaceId);
      setPosts(data);
    } catch (err) {
      const errMsg = parseApiError(err);
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const stats: PostStats = useMemo(() => {
    const publishedCount = posts.filter((p) => p.status === 'published').length;
    const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
    const failedCount = posts.filter((p) => p.status === 'failed').length;
    const draftsCount = posts.filter((p) => p.status === 'draft').length;

    return {
      total: posts.length,
      published: publishedCount,
      scheduled: scheduledCount,
      failed: failedCount,
      drafts: draftsCount,
    };
  }, [posts]);

  const createPost = async (dto: PostCreateDto): Promise<Post> => {
    try {
      const newPost = await postsService.createPost(dto, workspaceId);
      await refreshPosts();
      if (dto.status === 'published') {
        toast.success('Post published successfully.');
      } else if (dto.status === 'scheduled') {
        toast.success('Post scheduled successfully.');
      } else {
        toast.success('Post created successfully.');
      }
      return newPost;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Unable to create post.');
      throw err;
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>): Promise<Post> => {
    try {
      const updated = await postsService.updatePost(id, updates);
      await refreshPosts();
      toast.success('Post updated successfully.');
      return updated;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Unable to update post.');
      throw err;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const ok = await postsService.deletePost(id);
      if (ok) {
        await refreshPosts();
        toast.success('Post deleted successfully.');
      }
      return ok;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Unable to delete post.');
      return false;
    }
  };

  const duplicatePost = async (id: string): Promise<Post> => {
    try {
      const dup = await postsService.duplicatePost(id);
      await refreshPosts();
      toast.success('Post duplicated successfully.');
      return dup;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Unable to duplicate post.');
      throw err;
    }
  };

  const publishPost = async (id: string): Promise<Post> => {
    try {
      const pub = await postsService.publishPost(id);
      await refreshPosts();
      toast.success('Post published successfully.');
      return pub;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Unable to publish post.');
      throw err;
    }
  };

  const schedulePost = async (id: string, scheduledAt: string): Promise<Post> => {
    try {
      const scheduled = await postsService.schedulePost(id, scheduledAt);
      await refreshPosts();
      toast.success('Post scheduled successfully.');
      return scheduled;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Unable to schedule post.');
      throw err;
    }
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        error,
        stats,
        refreshPosts,
        createPost,
        updatePost,
        deletePost,
        duplicatePost,
        publishPost,
        schedulePost,
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
