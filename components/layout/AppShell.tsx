'use client';

import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar';
import { MobileSidebar } from './MobileSidebar';
import { Topbar } from './Topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Desktop & Tablet Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Mobile Drawer */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
