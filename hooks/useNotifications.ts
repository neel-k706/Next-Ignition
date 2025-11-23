import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  type: 'funding' | 'session' | 'review' | 'connection' | 'system' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'funding',
    title: 'New Funding Opportunity',
    message: 'An investor has shown interest in your startup',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    actionUrl: '/(tabs)/funding-status',
  },
  {
    id: '2',
    type: 'session',
    title: 'Mentorship Session Scheduled',
    message: 'Your session with John Doe is tomorrow at 2 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    actionUrl: '/(tabs)/mentorship',
  },
  {
    id: '3',
    type: 'review',
    title: 'New Review Received',
    message: 'You received a 5-star review from Jane Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    actionUrl: '/(tabs)/reviews',
  },
  {
    id: '4',
    type: 'connection',
    title: 'New Connection Request',
    message: 'Sarah Johnson wants to connect with you',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: false,
    actionUrl: '/(tabs)/network',
  },
  {
    id: '5',
    type: 'system',
    title: 'Platform Update',
    message: 'New features are now available. Check them out!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
  },
];

export function useNotifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Refresh notifications (simulate real-time update)
  const refresh = useCallback(async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real app, fetch from API
    setLoading(false);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationsByType,
    refresh,
  };
}

