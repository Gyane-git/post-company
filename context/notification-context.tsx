'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { NotificationItem } from '@/types/notification';
import { notificationsService } from '@/services/notifications.service';
import { useToast } from '@/context/toast-context';
import { useWorkspace } from '@/context/workspace-context';
import { parseApiError } from '@/lib/api/client';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = Number(currentWorkspace.id) || 1;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useToast();

  const refreshNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationsService.getNotifications(workspaceId);
      setNotifications(data);
    } catch (err) {
      const errMsg = parseApiError(err);
      toast.error(errMsg || 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, toast]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    try {
      const updated = await notificationsService.markAsRead(id, workspaceId);
      setNotifications(updated);
    } catch {
      // Local optimistic fallback
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  const markAllAsRead = async () => {
    try {
      const updated = await notificationsService.markAllAsRead(workspaceId);
      setNotifications(updated);
      toast.success('All notifications marked as read.');
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
