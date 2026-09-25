'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePosts } from '@/context/posts-context';
import { PageHeader } from '@/components/common/PageHeader';
import { PostFilters } from '@/components/posts/PostFilters';
import { PostCard } from '@/components/posts/PostCard';
import { PostTable } from '@/components/posts/PostTable';
import { PostDetailsModal } from '@/components/posts/PostDetailsModal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/Button';
import { PostStatus, Post } from '@/types/post';
import { SocialPlatform } from '@/types/social';
import { LayoutGrid, List, PlusCircle, FileText } from 'lucide-react';

export default function ContentPage() {
  const { posts, loading, error, refreshPosts, deletePost, duplicatePost, publishPost } = usePosts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Filter & sort logic
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (selectedStatus !== 'all') {
      result = result.filter((p) => p.status === selectedStatus);
    }

    if (selectedPlatform !== 'all') {
      result = result.filter((p) => p.platforms.includes(selectedPlatform));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.caption.toLowerCase().includes(q) ||
          p.hashtags.some((h) => h.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'date-desc') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'date-asc') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === 'views-desc') {
      result.sort((a, b) => (b.metrics?.views || 0) - (a.metrics?.views || 0));
    } else if (sortBy === 'engagement-desc') {
      result.sort((a, b) => (b.metrics?.engagementRate || 0) - (a.metrics?.engagementRate || 0));
    }

    return result;
  }, [posts, selectedStatus, selectedPlatform, searchQuery, sortBy]);

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      await deletePost(postToDelete);
      setPostToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Page Header */}
      <PageHeader
        title="Content Management"
        description="Organize, filter, and track all your published, scheduled, and draft marketing assets across connected networks."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <Link href="/create">
              <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Create Post
              </Button>
            </Link>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <PostFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Content Rendering: Loading vs Error vs Grid vs Table vs Empty State */}
      {loading && posts.length === 0 ? (
        <LoadingState type={viewMode === 'table' ? 'table' : 'card'} count={6} />
      ) : error && posts.length === 0 ? (
        <ErrorState
          title="Unable to load posts"
          message={error}
          onRetry={refreshPosts}
        />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-7 h-7" />}
          title="No posts matching filters"
          description="Try adjusting your search query, status filters, or platform selection to locate posts."
          action={{
            label: 'Create New Post',
            onClick: () => {
              window.location.href = '/create';
            },
            icon: <PlusCircle className="w-4 h-4" />,
          }}
        />
      ) : viewMode === 'table' ? (
        <PostTable
          posts={filteredPosts}
          onView={(p) => setSelectedPost(p)}
          onDuplicate={(id) => duplicatePost(id)}
          onDelete={(id) => setPostToDelete(id)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onView={(p) => setSelectedPost(p)}
              onDuplicate={(id) => duplicatePost(id)}
              onDelete={(id) => setPostToDelete(id)}
            />
          ))}
        </div>
      )}

      {/* Post Details Modal */}
      <PostDetailsModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        onPublishNow={(id) => publishPost(id)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This will permanently remove it from your content library."
        confirmLabel="Delete Post"
        variant="danger"
      />
    </div>
  );
}
