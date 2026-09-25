import { api } from './client';
import { NotificationResponse } from '@/types/api';

export const notificationsApi = {
  getAll: (): Promise<NotificationResponse[]> =>
    api.get<NotificationResponse[]>('/api/notifications'),

  getByWorkspace: (workspaceId: number): Promise<NotificationResponse[]> =>
    api.get<NotificationResponse[]>(`/api/notifications/workspace/${workspaceId}`),

  markAsRead: (id: number): Promise<NotificationResponse> =>
    api.put<NotificationResponse>(`/api/notifications/${id}/read`),

  markAllAsRead: (): Promise<boolean> =>
    api.put<boolean>('/api/notifications/read-all'),
};
