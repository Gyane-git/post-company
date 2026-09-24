'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, PlusCircle, Search, Moon, Sun } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { NotificationDropdown } from './NotificationDropdown';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/Button';

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 px-4 sm:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search posts, hashtags, campaigns..."
            className="w-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action: Create Post */}
        <Link href="/create">
          <Button size="sm" variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle theme mode"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5 text-amber-500" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <NotificationDropdown />

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* User Profile Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
