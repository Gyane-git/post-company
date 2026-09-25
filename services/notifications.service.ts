import { notificationsApi } from '@/lib/api/notifications';
import { adaptNotificationResponseToUi } from '@/lib/adapters';
import { NotificationItem } from '@/types/notification';
import { DEFAULT_WORKSPACE_ID } from '@/lib/config';

export const notificationsService = {
  async getNotifications(workspaceId: number = DEFAULT_WORKSPACE_ID): Promise<NotificationItem[]> {
    const raw = await notificationsApi.getByWorkspace(workspaceId);
    return raw.map(adaptNotificationResponseToUi);
  },

  async markAsRead(id: string, workspaceId: number = DEFAULT_WORKSPACE_ID): Promise<NotificationItem[]> {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) {
      await notificationsApi.markAsRead(numId);
    }
    return this.getNotifications(workspaceId);
  },

  async markAllAsRead(workspaceId: number = DEFAULT_WORKSPACE_ID): Promise<NotificationItem[]> {
    await notificationsApi.markAllAsRead();
    return this.getNotifications(workspaceId);
  },
};
