import { api } from './client';
import {
  WorkspaceResponse,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '@/types/api';

export const workspacesApi = {
  getAll: (): Promise<WorkspaceResponse[]> =>
    api.get<WorkspaceResponse[]>('/api/workspaces'),

  getById: (id: number): Promise<WorkspaceResponse> =>
    api.get<WorkspaceResponse>(`/api/workspaces/${id}`),

  create: (data: CreateWorkspaceRequest): Promise<WorkspaceResponse> =>
    api.post<WorkspaceResponse>('/api/workspaces', data),

  update: (id: number, data: UpdateWorkspaceRequest): Promise<WorkspaceResponse> =>
    api.put<WorkspaceResponse>(`/api/workspaces/${id}`, data),

  delete: (id: number): Promise<boolean> =>
    api.delete<boolean>(`/api/workspaces/${id}`),
};
