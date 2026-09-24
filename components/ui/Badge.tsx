import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
    secondary: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900',
    outline: 'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
    info: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
}
