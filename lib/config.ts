/**
 * Centralized API & Workspace configuration
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:5002';

export const DEFAULT_WORKSPACE_ID = 1;
export const DEFAULT_TIMEZONE = 'Asia/Kathmandu';
