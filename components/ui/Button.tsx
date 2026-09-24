'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

    const variants = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus-visible:ring-blue-500 border border-transparent',
      secondary:
        'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 border border-slate-200 dark:border-slate-700 focus-visible:ring-slate-400',
      outline:
        'border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 focus-visible:ring-slate-400',
      ghost:
        'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 focus-visible:ring-slate-400',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm focus-visible:ring-red-500 border border-transparent',
      success:
        'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm focus-visible:ring-emerald-500 border border-transparent',
    };

    const sizes = {
      sm: 'text-xs h-8 px-2.5 rounded-lg gap-1.5',
      md: 'text-sm h-9.5 px-3.5 rounded-lg gap-2',
      lg: 'text-base h-11 px-5 rounded-xl gap-2.5',
      icon: 'h-9 w-9 rounded-lg p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
