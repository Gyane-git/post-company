import { api } from './client';
import {
  SocialAccountResponse,
  CreateSocialAccountRequest,
  UpdateSocialAccountRequest,
} from '@/types/api';

export const socialAccountsApi = {
  getAll: (): Promise<SocialAccountResponse[]> =>
    api.get<SocialAccountResponse[]>('/api/social-accounts'),

  getByWorkspace: (workspaceId: number): Promise<SocialAccountResponse[]> =>
    api.get<SocialAccountResponse[]>(`/api/social-accounts/workspace/${workspaceId}`),

  getById: (id: number): Promise<SocialAccountResponse> =>
    api.get<SocialAccountResponse>(`/api/social-accounts/${id}`),

  connect: (id: number): Promise<SocialAccountResponse> =>
    api.post<SocialAccountResponse>(`/api/social-accounts/${id}/connect`),

  disconnect: (id: number): Promise<SocialAccountResponse> =>
    api.post<SocialAccountResponse>(`/api/social-accounts/${id}/disconnect`),

  create: (data: CreateSocialAccountRequest): Promise<SocialAccountResponse> =>
    api.post<SocialAccountResponse>('/api/social-accounts', data),

  update: (id: number, data: UpdateSocialAccountRequest): Promise<SocialAccountResponse> =>
    api.put<SocialAccountResponse>(`/api/social-accounts/${id}`, data),

  delete: (id: number): Promise<boolean> =>
    api.delete<boolean>(`/api/social-accounts/${id}`),
};
