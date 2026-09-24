import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs ${
        hover ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`font-semibold text-slate-900 dark:text-slate-100 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 py-3.5 bg-slate-50/70 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 rounded-b-xl ${className}`} {...props}>
      {children}
    </div>
  );
}
