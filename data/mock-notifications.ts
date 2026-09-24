import { NotificationItem } from '@/types/notification';

export const INITIAL_MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    type: 'publish_success',
    title: 'Post Published Successfully',
    message: '"Product Launch 2.0 Teaser Video" was published to Facebook, Instagram, and YouTube.',
    createdAt: '2026-09-23T14:30:10+05:45',
    read: false,
    link: '/content',
    metadata: { postId: 'post-001' },
  },
  {
    id: 'notif-002',
    type: 'publish_failed',
    title: 'TikTok Publishing Failed',
    message: '"Flash Sale Weekend" failed on TikTok due to expired session token. Please reconnect TikTok.',
    createdAt: '2026-09-23T19:05:00+05:45',
    read: false,
    link: '/social-accounts',
    metadata: { postId: 'post-005', platform: 'tiktok' },
  },
  {
    id: 'notif-003',
    type: 'scheduled_reminder',
    title: 'Upcoming Post in 24 Hours',
    message: '"Behind the Scenes: Creative Studio Shoot" is scheduled for tomorrow at 6:00 PM (Asia/Kathmandu).',
    createdAt: '2026-09-24T10:00:00+05:45',
    read: true,
    link: '/calendar',
    metadata: { postId: 'post-003' },
  },
  {
    id: 'notif-004',
    type: 'account_alert',
    title: 'Engagement Milestone Reached! 🚀',
    message: 'Your Instagram channel crossed 24,000 monthly engagements (+12.8% vs last month).',
    createdAt: '2026-09-24T08:15:00+05:45',
    read: true,
    link: '/analytics',
  },
];
