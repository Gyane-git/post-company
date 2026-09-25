import { api } from './client';
import {
  MediaResponse,
  CreateMediaRequest,
  UpdateMediaRequest,
} from '@/types/api';

export const mediaApi = {
  getAll: (): Promise<MediaResponse[]> =>
    api.get<MediaResponse[]>('/api/media'),

  getByWorkspace: (workspaceId: number): Promise<MediaResponse[]> =>
    api.get<MediaResponse[]>(`/api/media/workspace/${workspaceId}`),

  getById: (id: number): Promise<MediaResponse> =>
    api.get<MediaResponse>(`/api/media/${id}`),

  create: (data: CreateMediaRequest): Promise<MediaResponse> =>
    api.post<MediaResponse>('/api/media', data),

  update: (id: number, data: UpdateMediaRequest): Promise<MediaResponse> =>
    api.put<MediaResponse>(`/api/media/${id}`, data),

  delete: (id: number): Promise<boolean> =>
    api.delete<boolean>(`/api/media/${id}`),
};
