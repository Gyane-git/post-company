import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  description?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  description,
  className = '',
  onClick,
}: StatCardProps) {
  const isPositive = change ? (change.isPositive ?? change.value >= 0) : true;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-750">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      </div>

      {(change || description) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {isPositive ? '+' : ''}
              {change.value}%
            </span>
          )}
          <span className="text-slate-400 dark:text-slate-500">
            {change?.label || description}
          </span>
        </div>
      )}
    </div>
  );
}
