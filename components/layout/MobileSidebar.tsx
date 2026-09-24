'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Calendar,
  Share2,
  BarChart3,
  Sparkles,
  Settings,
  X,
  Zap,
} from 'lucide-react';
import { APP_CONFIG } from '@/config/app-config';
import { WorkspaceSelector } from './WorkspaceSelector';
import { usePosts } from '@/context/posts-context';
import { useWorkspace } from '@/context/workspace-context';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { stats } = usePosts();
  const { connectedCount } = useWorkspace();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null },
    { title: 'Content', href: '/content', icon: FileText, badge: stats.total },
    { title: 'Create Post', href: '/create', icon: PlusCircle, badge: null, highlight: true },
    { title: 'Calendar', href: '/calendar', icon: Calendar, badge: stats.scheduled },
    { title: 'Social Accounts', href: '/social-accounts', icon: Share2, badge: `${connectedCount}/4` },
    { title: 'Analytics', href: '/analytics', icon: BarChart3, badge: null },
    { title: 'AI Assistant', href: '/ai-assistant', icon: Sparkles, badge: 'PRO' },
    { title: 'Settings', href: '/settings', icon: Settings, badge: null },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
                {APP_CONFIG.name}
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <WorkspaceSelector />
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-bold'
                    : item.highlight
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.title}</span>
                </div>
                {item.badge !== null && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            href="/create"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Post</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
