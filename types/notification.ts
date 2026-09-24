export type NotificationType = 'publish_success' | 'publish_failed' | 'scheduled_reminder' | 'account_alert' | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
  metadata?: {
    postId?: string;
    platform?: string;
  };
}
