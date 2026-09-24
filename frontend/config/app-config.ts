/**
 * SocialHub Application Configuration
 * Centralized configuration to easily customize branding, name, defaults, and API endpoints.
 */

export const APP_CONFIG = {
  name: "SocialHub",
  tagline: "Unified Social Media Marketing Management",
  description: "Create, schedule, publish, and analyze your digital marketing content across Facebook, Instagram, TikTok, and YouTube from one dashboard.",
  version: "1.0.0",
  defaultTimezone: "Asia/Kathmandu",
  defaultWorkspace: {
    id: "ws-devmind",
    name: "DevMind Media Lab",
    slug: "devmind-media",
    plan: "Pro Enterprise",
  },
  platforms: [
    {
      id: "facebook",
      name: "Facebook",
      handle: "@devmindofficial",
      color: "#1877F2",
      iconBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
    },
    {
      id: "instagram",
      name: "Instagram",
      handle: "@devmind_official",
      color: "#E4405F",
      iconBg: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400",
    },
    {
      id: "tiktok",
      name: "TikTok",
      handle: "@devmind",
      color: "#000000",
      iconBg: "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100",
    },
    {
      id: "youtube",
      name: "YouTube",
      handle: "DevMind Official",
      color: "#FF0000",
      iconBg: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
    },
  ] as const,
  routes: {
    dashboard: "/dashboard",
    content: "/content",
    create: "/create",
    calendar: "/calendar",
    socialAccounts: "/social-accounts",
    analytics: "/analytics",
    aiAssistant: "/ai-assistant",
    settings: "/settings",
    login: "/login",
    forgotPassword: "/forgot-password",
  },
};
