import { api } from './client';
import { DashboardSummaryResponse } from '@/types/api';

export const dashboardApi = {
  getSummary: (workspaceId: number): Promise<DashboardSummaryResponse> =>
    api.get<DashboardSummaryResponse>(`/api/dashboard/${workspaceId}`),
};
