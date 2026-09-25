import { api } from './client';
import {
  AnalyticsSummaryResponse,
  AnalyticsSnapshotResponse,
} from '@/types/api';

export const analyticsApi = {
  getSummary: (workspaceId: number): Promise<AnalyticsSummaryResponse> =>
    api.get<AnalyticsSummaryResponse>(`/api/analytics/summary/${workspaceId}`),

  getWorkspaceSnapshots: (workspaceId: number): Promise<AnalyticsSnapshotResponse[]> =>
    api.get<AnalyticsSnapshotResponse[]>(`/api/analytics/workspace/${workspaceId}`),

  getSocialAccountSnapshots: (socialAccountId: number): Promise<AnalyticsSnapshotResponse[]> =>
    api.get<AnalyticsSnapshotResponse[]>(`/api/analytics/social-account/${socialAccountId}`),
};
