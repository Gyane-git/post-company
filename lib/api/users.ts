import { api } from './client';
import {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from '@/types/api';

export const usersApi = {
  getAll: (): Promise<UserResponse[]> =>
    api.get<UserResponse[]>('/api/users'),

  getById: (id: number): Promise<UserResponse> =>
    api.get<UserResponse>(`/api/users/${id}`),

  create: (data: CreateUserRequest): Promise<UserResponse> =>
    api.post<UserResponse>('/api/users', data),

  update: (id: number, data: UpdateUserRequest): Promise<UserResponse> =>
    api.put<UserResponse>(`/api/users/${id}`, data),

  delete: (id: number): Promise<boolean> =>
    api.delete<boolean>(`/api/users/${id}`),
};
