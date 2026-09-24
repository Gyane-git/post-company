import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this data. Please try again.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button size="sm" variant="outline" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Retry Operation
          </Button>
        </div>
      )}
    </div>
  );
}
