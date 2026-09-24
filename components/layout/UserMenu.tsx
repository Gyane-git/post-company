'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/context/workspace-context';
import { Dropdown } from '@/components/ui/Dropdown';
import { User, Settings, LogOut, ShieldCheck, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

export function UserMenu() {
  const router = useRouter();
  const { user } = useWorkspace();
  const { theme, toggleTheme } = useTheme();

  return (
    <Dropdown
      trigger={
        <button
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="User profile menu"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
          />
          <div className="hidden md:block text-left text-xs leading-none">
            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
            <p className="text-[11px] text-slate-400 mt-1">{user.role}</p>
          </div>
        </button>
      }
      align="right"
      items={[
        {
          id: 'user-info',
          label: user.email,
          icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
          disabled: true,
          onClick: () => {},
        },
        'separator',
        {
          id: 'profile',
          label: 'Profile Settings',
          icon: <User className="w-4 h-4" />,
          onClick: () => {
            router.push('/settings/profile');
          },
        },
        {
          id: 'workspace-settings',
          label: 'Workspace Settings',
          icon: <Settings className="w-4 h-4" />,
          onClick: () => {
            router.push('/settings/workspace');
          },
        },
        {
          id: 'toggle-theme',
          label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          icon: theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />,
          onClick: toggleTheme,
        },
        'separator',
        {
          id: 'logout',
          label: 'Sign out',
          icon: <LogOut className="w-4 h-4" />,
          danger: true,
          onClick: () => {
            router.push('/login');
          },
        },
      ]}
    />
  );
}
