'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SocialAccount } from '@/types/account';
import { SocialPlatform } from '@/types/social';
import { UserProfile, Workspace } from '@/types/user';
import { workspacesApi } from '@/lib/api/workspaces';
import { socialAccountsService } from '@/services/social-accounts.service';
import { adaptWorkspaceResponseToUi } from '@/lib/adapters';
import { DEFAULT_WORKSPACE_ID, DEFAULT_TIMEZONE } from '@/lib/config';
import { useToast } from '@/context/toast-context';
import { parseApiError } from '@/lib/api/client';

interface WorkspaceContextType {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  switchWorkspace: (workspaceId: string) => void;
  user: UserProfile;
  accounts: SocialAccount[];
  connectedCount: number;
  loadingAccounts: boolean;
  refreshAccounts: () => Promise<void>;
  connectAccount: (platform: SocialPlatform, username: string, displayName?: string) => Promise<SocialAccount>;
  disconnectAccount: (platform: SocialPlatform) => Promise<SocialAccount>;
  updateWorkspace: (id: string, data: { name?: string; slug?: string; description?: string }) => Promise<Workspace>;
  createWorkspace: (data: { name: string; slug: string; description?: string }) => Promise<Workspace>;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-01',
  name: 'Alex Mercer',
  email: 'alex.mercer@devmind.com',
  role: 'Owner',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Digital marketing lead and agency founder building omnichannel distribution.',
  timezone: DEFAULT_TIMEZONE,
  language: 'English',
};

const FALLBACK_WORKSPACE: Workspace = {
  id: String(DEFAULT_WORKSPACE_ID),
  name: 'DevMind Marketing',
  slug: 'devmind-marketing',
  logo: 'DM',
  plan: 'Pro Enterprise',
  members: [
    {
      id: 'usr-01',
      name: 'Alex Mercer',
      email: 'alex.mercer@devmind.com',
      role: 'Owner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      status: 'active',
    },
  ],
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([FALLBACK_WORKSPACE]);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string>(String(DEFAULT_WORKSPACE_ID));
  const [user] = useState<UserProfile>(DEFAULT_USER);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState<boolean>(true);
  const toast = useToast();

  const refreshAccounts = useCallback(async () => {
    try {
      setLoadingAccounts(true);
      const data = await socialAccountsService.getAccounts(Number(currentWorkspaceId) || DEFAULT_WORKSPACE_ID);
      setAccounts(data);
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Unable to load social accounts.');
    } finally {
      setLoadingAccounts(false);
    }
  }, [currentWorkspaceId, toast]);

  const loadWorkspaces = useCallback(async () => {
    try {
      const raw = await workspacesApi.getAll();
      if (raw && raw.length > 0) {
        const mapped = raw.map(adaptWorkspaceResponseToUi);
        setWorkspaces(mapped);
      }
    } catch {
      // Keep fallback workspace if fetch fails
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
    refreshAccounts();
  }, [loadWorkspaces, refreshAccounts]);

  const currentWorkspace = useMemo(() => {
    return workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0] || FALLBACK_WORKSPACE;
  }, [workspaces, currentWorkspaceId]);

  const connectedCount = useMemo(() => {
    return accounts.filter((a) => a.connected).length;
  }, [accounts]);

  const switchWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
  };

  const connectAccount = async (platform: SocialPlatform, username: string, displayName?: string) => {
    try {
      const wsId = Number(currentWorkspaceId) || DEFAULT_WORKSPACE_ID;
      const updated = await socialAccountsService.connectAccount(platform, username, displayName, wsId);
      await refreshAccounts();
      toast.success('Social account connected.');
      return updated;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || `Unable to connect ${platform}.`);
      throw err;
    }
  };

  const disconnectAccount = async (platform: SocialPlatform) => {
    try {
      const wsId = Number(currentWorkspaceId) || DEFAULT_WORKSPACE_ID;
      const updated = await socialAccountsService.disconnectAccount(platform, wsId);
      await refreshAccounts();
      toast.success('Social account disconnected.');
      return updated;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || `Unable to disconnect ${platform}.`);
      throw err;
    }
  };

  const updateWorkspace = async (id: string, data: { name?: string; slug?: string; description?: string }) => {
    try {
      const numId = parseInt(id, 10);
      const existing = workspaces.find((w) => w.id === id);
      const res = await workspacesApi.update(numId, {
        name: data.name ?? existing?.name ?? '',
        slug: data.slug ?? existing?.slug ?? '',
        description: data.description,
      });
      const mapped = adaptWorkspaceResponseToUi(res);
      setWorkspaces((prev) => prev.map((w) => (w.id === id ? mapped : w)));
      toast.success('Workspace updated successfully.');
      return mapped;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Failed to update workspace.');
      throw err;
    }
  };

  const createWorkspace = async (data: { name: string; slug: string; description?: string }) => {
    try {
      const res = await workspacesApi.create({
        name: data.name,
        slug: data.slug,
        description: data.description || '',
      });
      const mapped = adaptWorkspaceResponseToUi(res);
      setWorkspaces((prev) => [...prev, mapped]);
      setCurrentWorkspaceId(mapped.id);
      toast.success('Workspace created successfully.');
      return mapped;
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Failed to create workspace.');
      throw err;
    }
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
        refreshAccounts,
        connectAccount,
        disconnectAccount,
        updateWorkspace,
        createWorkspace,
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
