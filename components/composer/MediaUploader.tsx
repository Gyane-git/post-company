'use client';

import React, { useState, useRef } from 'react';
import { PostMedia } from '@/types/post';
import { UploadCloud, Film, Image as ImageIcon, Trash2, RefreshCw, Play, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MediaUploaderProps {
  media: PostMedia | null;
  onMediaChange: (media: PostMedia | null) => void;
}

export function MediaUploader({ media, onMediaChange }: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (filename: string, sizeBytes: number) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Set mock video media
          onMediaChange({
            id: `media-${Date.now()}`,
            type: 'video',
            url: 'https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-42840-large.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
            filename: filename || 'marketing-video-4k.mp4',
            sizeBytes: sizeBytes || 38400000,
            durationSec: 42,
            aspectRatio: '16:9',
          });
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      simulateUpload(file.name, file.size);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      simulateUpload(file.name, file.size);
    }
  };

  const loadSampleVideo = () => {
    simulateUpload('product-teaser-sample.mp4', 28500000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Media Asset
        </label>
        {!media && !isUploading && (
          <button
            type="button"
            onClick={loadSampleVideo}
            className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
          >
            + Use Sample Video
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="video/mp4,video/quicktime,video/webm,image/png,image/jpeg"
        className="hidden"
      />

      {isUploading ? (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-8 bg-slate-50 dark:bg-slate-900/60 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 flex items-center justify-center mx-auto animate-pulse">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Uploading Video... {uploadProgress}%
            </p>
            <p className="text-xs text-slate-400 mt-1">Processing transcoding & multi-aspect previews</p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : media ? (
        /* Video / Media Preview Card */
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.thumbnailUrl || media.url}
              alt="Media preview"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-white translate-x-0.5" />
              </div>
            </div>
            {media.durationSec && (
              <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
                0:{media.durationSec < 10 ? `0${media.durationSec}` : media.durationSec}
              </span>
            )}
          </div>

          <div className="p-4 pt-1 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {media.filename}
                </p>
                <p className="text-slate-400 font-mono text-[11px] mt-0.5">
                  {(media.sizeBytes / (1024 * 1024)).toFixed(1)} MB • {media.aspectRatio || '16:9'} • MP4
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<RefreshCw className="w-3 h-3" />}
                >
                  Replace
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onMediaChange(null)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  aria-label="Remove media"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
              : 'border-slate-300 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-900/40'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3.5 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Drag and drop your marketing video or image here
          </h4>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 max-w-sm">
            Supports MP4, MOV, WEBM, PNG, JPG up to 500MB. Auto-optimized for Instagram, Facebook, TikTok, and YouTube.
          </p>
          <div className="mt-4">
            <Button size="sm" variant="secondary" onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}>
              Browse Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
