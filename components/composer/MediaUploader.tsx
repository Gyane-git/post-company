'use client';

import React, { useState, useRef } from 'react';
import { PostMedia } from '@/types/post';
import { UploadCloud, Film, Trash2, RefreshCw, Play } from 'lucide-react';
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

  const processFile = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const isVideo = file.type.startsWith('video');
    const localPreviewUrl = URL.createObjectURL(file);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          onMediaChange({
            id: `local-${Date.now()}`,
            type: isVideo ? 'video' : 'image',
            url: localPreviewUrl,
            thumbnailUrl: localPreviewUrl,
            filename: file.name,
            sizeBytes: file.size,
            durationSec: isVideo ? 30 : undefined,
            aspectRatio: '16:9',
          });
          return 100;
        }
        return prev + 35;
      });
    }, 120);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const loadSampleVideo = () => {
    onMediaChange({
      id: '2', // Seeded backend Media ID 2
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      filename: 'product-launch-teaser.mp4',
      sizeBytes: 15890200,
      durationSec: 30,
      aspectRatio: '16:9',
    });
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
            + Use Seeded Video Sample
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
              Processing Local Media... {uploadProgress}%
            </p>
            <p className="text-xs text-slate-400 mt-1">Generating browser preview & metadata</p>
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
                  {(media.sizeBytes / (1024 * 1024)).toFixed(1)} MB • {media.aspectRatio || '16:9'} • {media.type.toUpperCase()}
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
            Supports MP4, MOV, WEBM, PNG, JPG. Local browser preview is shown; metadata will be registered with the API.
          </p>
          <div className="mt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
