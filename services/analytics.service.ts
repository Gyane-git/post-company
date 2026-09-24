import {
  MOCK_OVERVIEW_METRICS_30D,
  MOCK_PLATFORM_METRICS,
  MOCK_TIMESERIES_30D,
  MOCK_TIMESERIES_7D,
  MOCK_TOP_PERFORMING_POSTS,
} from '@/data/mock-analytics';
import { DateRangePreset, OverviewMetrics, PlatformMetrics, TimeSeriesPoint, TopPerformingPost } from '@/types/analytics';

export const analyticsService = {
  async getOverview(range: DateRangePreset): Promise<OverviewMetrics> {
    await new Promise((r) => setTimeout(r, 60));
    if (range === '7d') {
      return {
        ...MOCK_OVERVIEW_METRICS_30D,
        totalReach: 148200,
        impressions: 268000,
        engagement: 16400,
        likes: 12200,
        comments: 1420,
        shares: 2780,
        videoViews: 114500,
      };
    }
    if (range === '90d') {
      return {
        ...MOCK_OVERVIEW_METRICS_30D,
        totalReach: 1340000,
        impressions: 2480000,
        engagement: 154000,
        likes: 116000,
        comments: 13800,
        shares: 24200,
        videoViews: 980000,
      };
    }
    return MOCK_OVERVIEW_METRICS_30D;
  },

  async getTimeSeries(range: DateRangePreset): Promise<TimeSeriesPoint[]> {
    await new Promise((r) => setTimeout(r, 80));
    if (range === '7d') {
      return MOCK_TIMESERIES_7D;
    }
    return MOCK_TIMESERIES_30D;
  },

  async getPlatformMetrics(): Promise<PlatformMetrics[]> {
    await new Promise((r) => setTimeout(r, 60));
    return MOCK_PLATFORM_METRICS;
  },

  async getTopPerforming(): Promise<TopPerformingPost[]> {
    await new Promise((r) => setTimeout(r, 60));
    return MOCK_TOP_PERFORMING_POSTS;
  },
};
