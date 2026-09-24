import { INITIAL_MOCK_ACCOUNTS } from '@/data/mock-social-accounts';
import { SocialAccount } from '@/types/account';
import { SocialPlatform } from '@/types/social';

const mockAccountsDatabase: SocialAccount[] = [...INITIAL_MOCK_ACCOUNTS];

export const socialAccountsService = {
  async getAccounts(): Promise<SocialAccount[]> {
    await new Promise((r) => setTimeout(r, 60));
    return [...mockAccountsDatabase];
  },

  async connectAccount(platform: SocialPlatform, username: string, displayName?: string): Promise<SocialAccount> {
    await new Promise((r) => setTimeout(r, 120));
    const now = new Date().toISOString();

    const existingIndex = mockAccountsDatabase.findIndex((a) => a.platform === platform);
    if (existingIndex !== -1) {
      const updated: SocialAccount = {
        ...mockAccountsDatabase[existingIndex],
        username: username.replace('@', ''),
        displayName: displayName || username,
        connected: true,
        status: 'connected',
        connectedAt: now,
        followersCount: mockAccountsDatabase[existingIndex].followersCount || 12400,
      };
      mockAccountsDatabase[existingIndex] = updated;
      return updated;
    } else {
      const newAccount: SocialAccount = {
        id: `acc-${platform}`,
        platform,
        username: username.replace('@', ''),
        displayName: displayName || username,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        connected: true,
        status: 'connected',
        connectedAt: now,
        followersCount: 15400,
        permissions: ['read', 'publish_content', 'read_insights'],
      };
      mockAccountsDatabase.push(newAccount);
      return newAccount;
    }
  },

  async disconnectAccount(platform: SocialPlatform): Promise<SocialAccount> {
    await new Promise((r) => setTimeout(r, 100));
    const existingIndex = mockAccountsDatabase.findIndex((a) => a.platform === platform);
    if (existingIndex === -1) {
      throw new Error(`Account for ${platform} not found`);
    }

    const updated: SocialAccount = {
      ...mockAccountsDatabase[existingIndex],
      connected: false,
      status: 'disconnected',
      connectedAt: undefined,
    };
    mockAccountsDatabase[existingIndex] = updated;
    return updated;
  },
};
