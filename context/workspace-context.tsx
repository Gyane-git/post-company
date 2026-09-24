'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { SocialAccount } from '@/types/account';
import { SocialPlatform } from '@/types/social';
import { UserProfile, Workspace } from '@/types/user';
import { socialAccountsService } from '@/services/social-accounts.service';
import { INITIAL_MOCK_ACCOUNTS } from '@/data/mock-social-accounts';
import { APP_CONFIG } from '@/config/app-config';

interface WorkspaceContextType {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  switchWorkspace: (workspaceId: string) => void;
  user: UserProfile;
  accounts: SocialAccount[];
  connectedCount: number;
  loadingAccounts: boolean;
  connectAccount: (platform: SocialPlatform, username: string, displayName?: string) => Promise<SocialAccount>;
  disconnectAccount: (platform: SocialPlatform) => Promise<SocialAccount>;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-01',
  name: 'Gyanendra Shah',
  email: 'gyanendra@devmind.io',
  role: 'Owner',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Digital marketing lead and technical founder building omnichannel distribution.',
  timezone: APP_CONFIG.defaultTimezone,
  language: 'English',
};

const DEFAULT_WORKSPACES: Workspace[] = [
  {
    id: 'ws-devmind',
    name: 'DevMind Media Lab',
    slug: 'devmind-media',
    logo: 'DM',
    plan: 'Pro Enterprise',
    members: [
      { id: 'usr-01', name: 'Gyanendra Shah', email: 'gyanendra@devmind.io', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', status: 'active' },
      { id: 'usr-02', name: 'Suman Shrestha', email: 'suman@devmind.io', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', status: 'active' },
      { id: 'usr-03', name: 'Pooja Thapa', email: 'pooja@devmind.io', role: 'Member', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', status: 'active' },
    ],
  },
  {
    id: 'ws-client-growth',
    name: 'Apex Growth Agency',
    slug: 'apex-growth',
    logo: 'AG',
    plan: 'Growth Scale',
    members: [
      { id: 'usr-01', name: 'Gyanendra Shah', email: 'gyanendra@devmind.io', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', status: 'active' },
    ],
  },
];

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>('ws-devmind');
  const [user] = useState<UserProfile>(DEFAULT_USER);
  const [accounts, setAccounts] = useState<SocialAccount[]>(INITIAL_MOCK_ACCOUNTS);
  const [loadingAccounts] = useState<boolean>(false);

  const currentWorkspace = useMemo(() => {
    return workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0];
  }, [workspaces, currentWorkspaceId]);

  const connectedCount = useMemo(() => {
    return accounts.filter((a) => a.connected).length;
  }, [accounts]);

  const switchWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
  };

  const connectAccount = async (platform: SocialPlatform, username: string, displayName?: string) => {
    const updated = await socialAccountsService.connectAccount(platform, username, displayName);
    setAccounts((prev) => prev.map((a) => (a.platform === platform ? updated : a)));
    return updated;
  };

  const disconnectAccount = async (platform: SocialPlatform) => {
    const updated = await socialAccountsService.disconnectAccount(platform);
    setAccounts((prev) => prev.map((a) => (a.platform === platform ? updated : a)));
    return updated;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        switchWorkspace,
        user,
        accounts,
        connectedCount,
        loadingAccounts,
        connectAccount,
        disconnectAccount,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
