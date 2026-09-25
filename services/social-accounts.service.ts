import { socialAccountsApi } from '@/lib/api/social-accounts';
import { adaptSocialAccountResponseToUi, uiPlatformToBackend } from '@/lib/adapters';
import { SocialAccount } from '@/types/account';
import { SocialPlatform } from '@/types/social';
import { DEFAULT_WORKSPACE_ID } from '@/lib/config';

export const socialAccountsService = {
  async getAccounts(workspaceId: number = DEFAULT_WORKSPACE_ID): Promise<SocialAccount[]> {
    const rawAccounts = await socialAccountsApi.getByWorkspace(workspaceId);
    return rawAccounts.map(adaptSocialAccountResponseToUi);
  },

  async connectAccount(
    platform: SocialPlatform,
    username: string,
    displayName?: string,
    workspaceId: number = DEFAULT_WORKSPACE_ID
  ): Promise<SocialAccount> {
    const backendPlatform = uiPlatformToBackend(platform);
    const existing = await socialAccountsApi.getByWorkspace(workspaceId);
    const target = existing.find(
      (a) => a.platform.toLowerCase() === backendPlatform.toLowerCase()
    );

    if (target) {
      // Connect existing account
      const res = await socialAccountsApi.connect(target.id);
      return adaptSocialAccountResponseToUi(res);
    }

    // Create and connect if not already present
    const created = await socialAccountsApi.create({
      workspaceId,
      platform: backendPlatform,
      platformAccountId: `${platform}_${Date.now()}`,
      username: username.replace('@', ''),
      displayName: displayName || username,
    });

    const connected = await socialAccountsApi.connect(created.id);
    return adaptSocialAccountResponseToUi(connected);
  },

  async disconnectAccount(platform: SocialPlatform, workspaceId: number = DEFAULT_WORKSPACE_ID): Promise<SocialAccount> {
    const backendPlatform = uiPlatformToBackend(platform);
    const existing = await socialAccountsApi.getByWorkspace(workspaceId);
    const target = existing.find(
      (a) => a.platform.toLowerCase() === backendPlatform.toLowerCase()
    );

    if (!target) {
      throw new Error(`Account for ${platform} not found.`);
    }

    const res = await socialAccountsApi.disconnect(target.id);
    return adaptSocialAccountResponseToUi(res);
  },
};
