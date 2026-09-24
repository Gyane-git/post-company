'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            variant === 'danger'
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
              : 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
          }`}
        >
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
