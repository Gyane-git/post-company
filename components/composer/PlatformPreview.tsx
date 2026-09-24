'use client';

import React, { useState } from 'react';
import { SocialPlatform } from '@/types/social';
import { PostMedia } from '@/types/post';
import { SocialPlatformIcon } from '@/components/common/SocialPlatformIcon';
import {
  Heart,
  MessageCircle,
  Share2,
  ThumbsUp,
  Bookmark,
  MoreHorizontal,
  Play,
  Volume2,
  Music,
} from 'lucide-react';

interface PlatformPreviewProps {
  platform: SocialPlatform;
  caption: string;
  hashtags: string[];
  media: PostMedia | null;
}

export function PlatformPreview({ platform, caption, hashtags, media }: PlatformPreviewProps) {
  const fullCaption = caption || 'Your caption preview will appear here as you type...';
  const hasMedia = !!media;

  // Render platform specific mock view
  if (platform === 'instagram') {
    return (
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm mx-auto overflow-hidden shadow-sm text-xs font-sans">
        {/* Instagram Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-pink-600">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Account"
                className="w-full h-full rounded-full object-cover border border-white dark:border-black"
              />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white leading-none">devmindofficial</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Kathmandu, Nepal</p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        {/* Media Frame */}
        <div className="relative aspect-square bg-slate-950 flex items-center justify-center overflow-hidden">
          {hasMedia ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media?.thumbnailUrl || media?.url}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-slate-500 text-xs">
              <SocialPlatformIcon platform="instagram" size={28} className="mx-auto mb-2 opacity-50" />
              Upload media to preview Instagram post
            </div>
          )}
          {media?.type === 'video' && (
            <div className="absolute top-3 right-3 bg-black/60 rounded-full p-1.5 text-white">
              <Play className="w-3.5 h-3.5 fill-white" />
            </div>
          )}
        </div>

        {/* Actions bar */}
        <div className="p-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Heart className="w-5 h-5 text-slate-800 dark:text-slate-100 hover:text-red-500 transition-colors" />
            <MessageCircle className="w-5 h-5 text-slate-800 dark:text-slate-100 -rotate-90" />
            <Share2 className="w-5 h-5 text-slate-800 dark:text-slate-100" />
          </div>
          <Bookmark className="w-5 h-5 text-slate-800 dark:text-slate-100" />
        </div>

        {/* Likes and Caption */}
        <div className="px-3 pb-3 space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">1,420 likes</p>
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-white mr-1.5">devmindofficial</span>
            {fullCaption}
          </p>
          {hashtags.length > 0 && (
            <p className="text-blue-600 dark:text-blue-400 text-[11px] font-medium">
              {hashtags.join(' ')}
            </p>
          )}
          <p className="text-[10px] text-slate-400 pt-1 uppercase">Just now</p>
        </div>
      </div>
    );
  }

  if (platform === 'facebook') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm mx-auto overflow-hidden shadow-sm text-xs font-sans">
        {/* Facebook Header */}
        <div className="p-3.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
              alt="Facebook Page"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-slate-900 dark:text-white leading-tight">DevMind Official</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>Just now</span> • <span>🌐</span>
              </p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        {/* Facebook Caption */}
        <div className="p-3.5 space-y-2">
          <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {fullCaption}
          </p>
          {hashtags.length > 0 && (
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              {hashtags.join(' ')}
            </p>
          )}
        </div>

        {/* Media Frame */}
        <div className="aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
          {hasMedia ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media?.thumbnailUrl || media?.url}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-slate-500 text-xs">
              <SocialPlatformIcon platform="facebook" size={28} className="mx-auto mb-2 opacity-50" />
              Facebook post preview
            </div>
          )}
        </div>

        {/* Facebook Engagement Counts */}
        <div className="p-2.5 px-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-slate-500 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
              👍
            </span>
            <span>248</span>
          </div>
          <div>
            <span>42 comments • 18 shares</span>
          </div>
        </div>

        {/* FB Action Bar */}
        <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800 py-1.5 text-center text-slate-600 dark:text-slate-300 font-semibold">
          <button className="py-1 flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">
            <ThumbsUp className="w-3.5 h-3.5" /> Like
          </button>
          <button className="py-1 flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">
            <MessageCircle className="w-3.5 h-3.5" /> Comment
          </button>
          <button className="py-1 flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    );
  }

  if (platform === 'tiktok') {
    return (
      <div className="bg-black text-white rounded-3xl max-w-[270px] mx-auto overflow-hidden shadow-2xl relative aspect-[9/16] flex flex-col justify-between p-3 border-4 border-slate-800">
        {/* Background / Media Video */}
        <div className="absolute inset-0 z-0">
          {hasMedia ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media?.thumbnailUrl || media?.url}
              alt="TikTok"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
              <SocialPlatformIcon platform="tiktok" size={32} className="mb-2 opacity-60" />
              <p className="text-xs">9:16 Full Screen Vertical Video</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />
        </div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between text-xs pt-1">
          <span className="font-semibold text-slate-300 text-[11px]">Following</span>
          <span className="font-bold text-white border-b-2 border-white pb-0.5">For You</span>
          <Volume2 className="w-4 h-4 text-white" />
        </div>

        {/* Right side interactions */}
        <div className="relative z-10 self-end flex flex-col items-center gap-4 pb-12 pr-1">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="TikTok Creator"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
              +
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">28.4k</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">492</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">1.8k</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <Share2 className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-bold mt-1">310</span>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="relative z-10 space-y-1.5 pb-2 text-left">
          <p className="font-bold text-xs">@devmind_global</p>
          <p className="text-[11px] text-slate-100 line-clamp-2 leading-snug">
            {fullCaption}
          </p>
          {hashtags.length > 0 && (
            <p className="text-[10px] font-bold text-white line-clamp-1">
              {hashtags.join(' ')}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
            <Music className="w-3 h-3 animate-spin" />
            <span className="truncate">Original Sound - DevMind Audio</span>
          </div>
        </div>
      </div>
    );
  }

  // YouTube Shorts / Player Preview
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm mx-auto overflow-hidden shadow-sm text-xs font-sans">
      {/* Video Player */}
      <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
        {hasMedia ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media?.thumbnailUrl || media?.url}
            alt="YouTube"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6 text-slate-500">
            <SocialPlatformIcon platform="youtube" size={32} className="mx-auto mb-2 opacity-60 text-red-600" />
            <p>16:9 HD Video Player</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 space-y-3">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
          {fullCaption.slice(0, 60)}...
        </h4>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>DevMind Channel • 14K views • 2 hours ago</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
              alt="YouTube channel"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">DevMind Channel</p>
              <p className="text-[10px] text-slate-400">46.3K subscribers</p>
            </div>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-full">
            Subscribe
          </button>
        </div>

        {/* Description box */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
          <p className="line-clamp-2 leading-relaxed">{fullCaption}</p>
          {hashtags.length > 0 && (
            <p className="mt-1 text-blue-600 dark:text-blue-400 font-medium">
              {hashtags.join(' ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
