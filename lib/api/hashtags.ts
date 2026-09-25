import { api } from './client';
import { HashtagResponse } from '@/types/api';

export const hashtagsApi = {
  getAll: (): Promise<HashtagResponse[]> =>
    api.get<HashtagResponse[]>('/api/hashtags'),

  create: (name: string): Promise<HashtagResponse> =>
    api.post<HashtagResponse>('/api/hashtags', { name }),

  delete: (id: number): Promise<boolean> =>
    api.delete<boolean>(`/api/hashtags/${id}`),
};
