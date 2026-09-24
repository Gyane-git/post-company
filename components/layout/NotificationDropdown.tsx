'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/context/notification-context';
import { Bell, CheckCheck, ExternalLink, AlertTriangle, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'publish_success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'publish_failed':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'scheduled_reminder':
        return <Clock className="w-4 h-4 text-sky-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[11px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No notifications yet</div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex gap-3 ${
                    !item.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs ${!item.read ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        <span>View details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              href="/settings/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
            >
              Notification preferences
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
