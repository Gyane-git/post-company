'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 transition-all my-8 animate-in fade-in-0 zoom-in-95`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              {title && (
                <h3 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="px-6 py-5 max-h-[calc(85vh-130px)] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
