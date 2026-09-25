import { api } from './client';
import {
  PostResponse,
  CreatePostRequest,
  UpdatePostRequest,
  SchedulePostRequest,
  PostQueryParameters,
} from '@/types/api';

export const postsApi = {
  getAll: (params?: PostQueryParameters): Promise<PostResponse[]> =>
    api.get<PostResponse[]>('/api/posts', params as Record<string, string | number | boolean | undefined | null>),

  getByWorkspace: (workspaceId: number): Promise<PostResponse[]> =>
    api.get<PostResponse[]>(`/api/posts/workspace/${workspaceId}`),

  getById: (id: number): Promise<PostResponse> =>
    api.get<PostResponse>(`/api/posts/${id}`),

  create: (data: CreatePostRequest): Promise<PostResponse> =>
    api.post<PostResponse>('/api/posts', data),

  update: (id: number, data: UpdatePostRequest): Promise<PostResponse> =>
    api.put<PostResponse>(`/api/posts/${id}`, data),

  delete: (id: number): Promise<boolean> =>
    api.delete<boolean>(`/api/posts/${id}`),

  publish: (id: number): Promise<PostResponse> =>
    api.post<PostResponse>(`/api/posts/${id}/publish`),

  schedule: (id: number, data: SchedulePostRequest): Promise<PostResponse> =>
    api.post<PostResponse>(`/api/posts/${id}/schedule`, data),

  duplicate: (id: number): Promise<PostResponse> =>
    api.post<PostResponse>(`/api/posts/${id}/duplicate`),

  retry: (id: number): Promise<PostResponse> =>
    api.post<PostResponse>(`/api/posts/${id}/retry`),
};
