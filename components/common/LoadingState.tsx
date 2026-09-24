import React from 'react';

interface LoadingStateProps {
  type?: 'card' | 'table' | 'full';
  count?: number;
}

export function LoadingState({ type = 'card', count = 3 }: LoadingStateProps) {
  if (type === 'table') {
    return (
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden animate-pulse">
        <div className="h-12 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-slate-100 dark:border-slate-800/60"
          >
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
            </div>
            <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'full') {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="h-72 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3"
        >
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
}
