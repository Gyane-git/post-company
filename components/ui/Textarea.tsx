'use client';

import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  maxCharacters?: number;
  currentCharCount?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, maxCharacters, currentCharCount, className = '', id, value, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const count = currentCharCount ?? (typeof value === 'string' ? value.length : 0);

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {label}
            </label>
          )}
          {maxCharacters !== undefined && (
            <span
              className={`text-xs ${
                count > maxCharacters
                  ? 'text-red-600 font-semibold'
                  : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              {count} / {maxCharacters}
            </span>
          )}
        </div>
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          className={`w-full bg-white dark:bg-slate-900 border rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 p-3.5 ${
            error
              ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
              : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
