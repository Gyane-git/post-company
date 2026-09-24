import { INITIAL_MOCK_NOTIFICATIONS } from '@/data/mock-notifications';
import { NotificationItem } from '@/types/notification';

let mockNotifications: NotificationItem[] = [...INITIAL_MOCK_NOTIFICATIONS];

export const notificationsService = {
  async getNotifications(): Promise<NotificationItem[]> {
    await new Promise((r) => setTimeout(r, 40));
    return [...mockNotifications];
  },

  async markAsRead(id: string): Promise<NotificationItem[]> {
    mockNotifications = mockNotifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    return [...mockNotifications];
  },

  async markAllAsRead(): Promise<NotificationItem[]> {
    mockNotifications = mockNotifications.map((n) => ({ ...n, read: true }));
    return [...mockNotifications];
  },
};
