'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePosts } from '@/context/posts-context';
import { PageHeader } from '@/components/common/PageHeader';
import { MediaUploader } from '@/components/composer/MediaUploader';
import { PlatformSelector } from '@/components/composer/PlatformSelector';
import { CaptionEditor } from '@/components/composer/CaptionEditor';
import { HashtagInput } from '@/components/composer/HashtagInput';
import { PlatformPreview } from '@/components/composer/PlatformPreview';
import { ScheduleModal } from '@/components/calendar/ScheduleModal';
import { PublishResultModal } from '@/components/composer/PublishResultModal';
import { SocialPlatform } from '@/types/social';
import { PostMedia } from '@/types/post';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import {
  Save,
  Send,
  Calendar as CalendarIcon,
  Sparkles,
  Eye,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function CreatePostPage() {
  const router = useRouter();
  const { createPost } = usePosts();

  // Composer Form State
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState(
    'Excited to announce our new omnichannel publishing suite! Manage Facebook, Instagram, TikTok, and YouTube from one single dashboard.'
  );
  const [hashtags, setHashtags] = useState<string[]>([
    '#digitalmarketing',
    '#nepal',
    '#business',
    '#socialmedia',
  ]);
  const [media, setMedia] = useState<PostMedia | null>({
    id: 'sample-vid',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42840-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    filename: 'omnichannel-launch-teaser.mp4',
    sizeBytes: 34500000,
    durationSec: 45,
    aspectRatio: '16:9',
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'facebook',
    'instagram',
    'youtube',
  ]);

  // Preview tab state
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('instagram');

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPublishResult, setShowPublishResult] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [draftSavedFeedback, setDraftSavedFeedback] = useState(false);

  // Platform selection handlers
  const handleTogglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length === 1) return; // keep at least 1
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      if (previewPlatform === p) {
        const remaining = selectedPlatforms.filter((item) => item !== p);
        if (remaining.length > 0) setPreviewPlatform(remaining[0]);
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
      setPreviewPlatform(p);
    }
  };

  const handleSelectAllPlatforms = () => {
    if (selectedPlatforms.length === 4) {
      setSelectedPlatforms(['instagram']);
      setPreviewPlatform('instagram');
    } else {
      setSelectedPlatforms(['facebook', 'instagram', 'tiktok', 'youtube']);
    }
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      await createPost({
        title: title || caption.slice(0, 45),
        caption,
        hashtags,
        media: media ? [media] : [],
        platforms: selectedPlatforms,
        status: 'draft',
      });
      setDraftSavedFeedback(true);
      setTimeout(() => setDraftSavedFeedback(false), 2500);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Publish Now
  const handlePublishNow = async () => {
    await createPost({
      title: title || caption.slice(0, 45),
      caption,
      hashtags,
      media: media ? [media] : [],
      platforms: selectedPlatforms,
      status: 'published',
    });
    setShowPublishResult(true);
  };

  // Confirm Schedule
  const handleConfirmSchedule = async (scheduledDateTime: string, timezone: string) => {
    await createPost({
      title: title || caption.slice(0, 45),
      caption,
      hashtags,
      media: media ? [media] : [],
      platforms: selectedPlatforms,
      status: 'scheduled',
      scheduledAt: scheduledDateTime,
      timezone,
    });
    router.push('/calendar');
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Header */}
      <PageHeader
        title="Content Composer"
        description="Author, optimize, preview, and dispatch your video or image across Facebook, Instagram, TikTok, and YouTube."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content', href: '/content' },
          { label: 'Composer' },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              isLoading={isSavingDraft}
              leftIcon={draftSavedFeedback ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Save className="w-3.5 h-3.5" />}
            >
              {draftSavedFeedback ? 'Draft Saved' : 'Save Draft'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowScheduleModal(true)}
              leftIcon={<CalendarIcon className="w-3.5 h-3.5" />}
            >
              Schedule Post
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handlePublishNow}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Publish Now
            </Button>
          </div>
        }
      />

      {/* Main Composer Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* LEFT SIDE: Media Upload & Interactive Preview */}
        <div className="lg:col-span-6 space-y-6">
          {/* Media Upload Area */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <MediaUploader media={media} onMediaChange={setMedia} />
          </div>

          {/* Platform Live Preview Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Live Feed Preview
                </h4>
              </div>

              {/* Platform Switcher Pills */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                {selectedPlatforms.map((plat) => (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => setPreviewPlatform(plat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      previewPlatform === plat
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
            </div>

            {/* Live mockup card */}
            <div className="py-2">
              <PlatformPreview
                platform={previewPlatform}
                caption={caption}
                hashtags={hashtags}
                media={media}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Post Settings & Content Fields */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
            {/* Title / Internal Campaign Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Campaign / Post Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Q4 Omnichannel Marketing Announcement"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Platform Selector */}
            <PlatformSelector
              selectedPlatforms={selectedPlatforms}
              onTogglePlatform={handleTogglePlatform}
              onSelectAll={handleSelectAllPlatforms}
            />

            {/* Caption Editor */}
            <CaptionEditor
              caption={caption}
              onChange={setCaption}
              selectedPlatforms={selectedPlatforms}
              onOpenAiHelper={() => router.push('/ai-assistant')}
            />

            {/* Hashtag Input */}
            <HashtagInput hashtags={hashtags} onChange={setHashtags} />

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleSaveDraft}
                  isLoading={isSavingDraft}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Save Draft
                </Button>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setShowScheduleModal(true)}
                  leftIcon={<CalendarIcon className="w-4 h-4" />}
                >
                  Schedule Post
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handlePublishNow}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Publish Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Post Modal */}
      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        platforms={selectedPlatforms}
        postTitle={title || caption.slice(0, 45)}
        onConfirmSchedule={handleConfirmSchedule}
      />

      {/* Publishing Progress and Results Modal */}
      <PublishResultModal
        isOpen={showPublishResult}
        onClose={() => setShowPublishResult(false)}
        platforms={selectedPlatforms}
        postTitle={title || caption.slice(0, 45)}
      />
    </div>
  );
}
