'use client';

import React from 'react';
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
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { APP_CONFIG } from '@/config/app-config';
import { WorkspaceSelector } from './WorkspaceSelector';
import { usePosts } from '@/context/posts-context';
import { useWorkspace } from '@/context/workspace-context';

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AppSidebar({ collapsed, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const { stats } = usePosts();
  const { connectedCount } = useWorkspace();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: 'Content',
      href: '/content',
      icon: FileText,
      badge: stats.total > 0 ? stats.total : null,
    },
    {
      title: 'Create Post',
      href: '/create',
      icon: PlusCircle,
      highlight: true,
      badge: null,
    },
    {
      title: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      badge: stats.scheduled > 0 ? stats.scheduled : null,
    },
    {
      title: 'Social Accounts',
      href: '/social-accounts',
      icon: Share2,
      badge: `${connectedCount}/4`,
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      title: 'AI Assistant',
      href: '/ai-assistant',
      icon: Sparkles,
      badge: 'PRO',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`relative hidden lg:flex flex-col border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
                {APP_CONFIG.name}
              </span>
              <span className="ml-1.5 text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/70 dark:text-blue-400 px-1.5 py-0.5 rounded">
                SaaS
              </span>
            </div>
          )}
        </Link>

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Workspace Selector */}
      {!collapsed ? (
        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <WorkspaceSelector />
        </div>
      ) : (
        <div className="p-3 flex justify-center border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            DM
          </div>
        </div>
      )}

      {/* Nav Menu */}
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
              title={collapsed ? item.title : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-bold shadow-xs'
                  : item.highlight
                  ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : item.highlight
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600'
                }`}
              />

              {!collapsed && (
                <div className="flex items-center justify-between w-full min-w-0">
                  <span className="truncate">{item.title}</span>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.badgeColor ||
                        (isActive
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Create CTA at bottom */}
      {!collapsed && (
        <div className="p-3 m-3 rounded-xl bg-linear-to-br from-slate-50 to-blue-50/40 dark:from-slate-850 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-800 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              Omnichannel Ready
            </p>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2.5">
            Publish simultaneously to Facebook, Instagram, TikTok & YouTube.
          </p>
          <Link
            href="/create"
            className="block text-center text-xs font-semibold py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            New Post
          </Link>
        </div>
      )}
    </aside>
  );
}
