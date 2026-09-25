'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { usePosts } from '@/context/posts-context';
import { postsService } from '@/services/posts.service';
import { PageHeader } from '@/components/common/PageHeader';
import { MediaUploader } from '@/components/composer/MediaUploader';
import { PlatformSelector } from '@/components/composer/PlatformSelector';
import { CaptionEditor } from '@/components/composer/CaptionEditor';
import { HashtagInput } from '@/components/composer/HashtagInput';
import { PlatformPreview } from '@/components/composer/PlatformPreview';
import { SocialPlatform } from '@/types/social';
import { Post, PostMedia } from '@/types/post';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/common/LoadingState';
import { Save } from 'lucide-react';
import Link from 'next/link';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { posts, updatePost } = usePosts();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [media, setMedia] = useState<PostMedia | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram']);
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('instagram');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const existing = posts.find((p) => p.id === id);
    if (existing) {
      setPost(existing);
      setTitle(existing.title);
      setCaption(existing.caption);
      setHashtags(existing.hashtags);
      setMedia(existing.media[0] || null);
      setSelectedPlatforms(existing.platforms);
      if (existing.platforms.length > 0) {
        setPreviewPlatform(existing.platforms[0]);
      }
      setLoading(false);
    } else {
      setLoading(true);
      postsService
        .getPostById(id)
        .then((fetched) => {
          if (fetched) {
            setPost(fetched);
            setTitle(fetched.title);
            setCaption(fetched.caption);
            setHashtags(fetched.hashtags);
            setMedia(fetched.media[0] || null);
            setSelectedPlatforms(fetched.platforms);
            if (fetched.platforms.length > 0) {
              setPreviewPlatform(fetched.platforms[0]);
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, posts]);

  if (loading) {
    return (
      <div className="py-12">
        <LoadingState type="full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm font-semibold">Post not found</p>
        <Link href="/content" className="mt-3 inline-block">
          <Button size="sm" variant="outline">
            Back to Library
          </Button>
        </Link>
      </div>
    );
  }

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await updatePost(post.id, {
        title,
        caption,
        hashtags,
        media: media ? [media] : [],
        platforms: selectedPlatforms,
      });
      router.push('/content');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      <PageHeader
        title={`Edit: ${post.title}`}
        description="Modify caption, media, and target platforms."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content', href: '/content' },
          { label: 'Edit Post' },
        ]}
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleUpdate}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <MediaUploader media={media} onMediaChange={setMedia} />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Live Feed Preview</h4>
            <PlatformPreview
              platform={previewPlatform}
              caption={caption}
              hashtags={hashtags}
              media={media}
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={(p) => {
                if (selectedPlatforms.includes(p)) {
                  if (selectedPlatforms.length > 1) {
                    setSelectedPlatforms(selectedPlatforms.filter((i) => i !== p));
                  }
                } else {
                  setSelectedPlatforms([...selectedPlatforms, p]);
                }
              }}
              onSelectAll={() =>
                setSelectedPlatforms(['facebook', 'instagram', 'tiktok', 'youtube'])
              }
            />

            <CaptionEditor
              caption={caption}
              onChange={setCaption}
              selectedPlatforms={selectedPlatforms}
            />

            <HashtagInput hashtags={hashtags} onChange={setHashtags} />

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button size="sm" variant="primary" onClick={handleUpdate} isLoading={isSaving}>
                Update Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
