import { SocialPlatform } from './social';

export type ConnectionStatus = 'connected' | 'disconnected' | 'expired' | 'error';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatarUrl: string;
  connected: boolean;
  status: ConnectionStatus;
  connectedAt?: string;
  followersCount: number;
  profileUrl?: string;
  accountType?: 'business' | 'creator' | 'personal';
  permissions: string[];
}

export interface ConnectAccountModalState {
  isOpen: boolean;
  platform: SocialPlatform | null;
}
