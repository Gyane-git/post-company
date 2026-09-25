'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '@/context/workspace-context';
import { analyticsService } from '@/services/analytics.service';
import { parseApiError } from '@/lib/api/client';
import { DateRangePreset, OverviewMetrics, PlatformMetrics, TimeSeriesPoint, TopPerformingPost } from '@/types/analytics';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { AreaChart } from '@/components/charts/AreaChart';
import { BarChart } from '@/components/charts/BarChart';
import { PlatformComparisonChart } from '@/components/charts/PlatformComparisonChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { PlatformMetricCard } from '@/components/analytics/PlatformMetricCard';
import { TopContentTable } from '@/components/analytics/TopContentTable';
import {
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { currentWorkspace } = useWorkspace();
  const workspaceId = Number(currentWorkspace.id) || 1;

  const [range, setRange] = useState<DateRangePreset>('30d');
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [timeseries, setTimeseries] = useState<TimeSeriesPoint[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([]);
  const [topPosts, setTopPosts] = useState<TopPerformingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active chart tab
  const [activeChartMetric, setActiveChartMetric] = useState<'reach' | 'engagement' | 'views'>('reach');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [overviewData, tsData, platData, topData] = await Promise.all([
        analyticsService.getOverview(range, workspaceId),
        analyticsService.getTimeSeries(range, workspaceId),
        analyticsService.getPlatformMetrics(workspaceId),
        analyticsService.getTopPerforming(workspaceId),
      ]);

      setMetrics(overviewData);
      setTimeseries(tsData);
      setPlatformMetrics(platData);
      setTopPosts(topData);
    } catch (err) {
      const errMsg = parseApiError(err);
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [range, workspaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const donutItems = platformMetrics.map((p) => {
    const colors: Record<string, string> = {
      facebook: '#1877F2',
      instagram: '#E4405F',
      tiktok: '#111827',
      youtube: '#FF0000',
    };
    return {
      platform: p.platform,
      label: p.displayName,
      value: p.engagement,
      color: colors[p.platform] || '#3b82f6',
    };
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
      {/* Page Header */}
      <PageHeader
        title="Performance Analytics"
        description="Comprehensive cross-network reach, video views, engagement rates, and top performing creative assets."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics' },
        ]}
        actions={
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                  range === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        }
      />

      {/* Loading & Error States */}
      {isLoading && !metrics ? (
        <LoadingState type="full" />
      ) : error && !metrics ? (
        <ErrorState
          title="Unable to load analytics"
          message={error}
          onRetry={fetchData}
        />
      ) : (
        <>
          {/* Top 8 Primary Metric Cards */}
          {metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          <StatCard
            title="Total Reach"
            value={metrics.totalReach}
            change={{ value: metrics.reachChangePct }}
            icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
          />
          <StatCard
            title="Total Impressions"
            value={metrics.impressions}
            change={{ value: metrics.impressionsChangePct }}
            icon={<Eye className="w-4 h-4 text-indigo-600" />}
          />
          <StatCard
            title="Video Views"
            value={metrics.videoViews}
            change={{ value: metrics.videoViewsChangePct }}
            icon={<BarChart3 className="w-4 h-4 text-purple-600" />}
          />
          <StatCard
            title="Total Followers"
            value={metrics.followers}
            change={{ value: metrics.followersChangePct }}
            icon={<Users className="w-4 h-4 text-emerald-600" />}
          />
          <StatCard
            title="Total Engagement"
            value={metrics.engagement}
            change={{ value: metrics.engagementChangePct }}
            icon={<Heart className="w-4 h-4 text-pink-600" />}
          />
          <StatCard
            title="Post Likes"
            value={metrics.likes}
            change={{ value: metrics.likesChangePct }}
            icon={<Heart className="w-4 h-4 text-rose-600" />}
          />
          <StatCard
            title="Comments"
            value={metrics.comments}
            change={{ value: metrics.commentsChangePct }}
            icon={<MessageCircle className="w-4 h-4 text-sky-600" />}
          />
          <StatCard
            title="Shares & Reposts"
            value={metrics.shares}
            change={{ value: metrics.sharesChangePct }}
            icon={<Share2 className="w-4 h-4 text-amber-600" />}
          />
        </div>
      )}

      {/* Primary Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Time-series Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Audience Growth & Velocity Over Time</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily telemetry data synchronized across connected accounts
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {(['reach', 'engagement', 'views'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveChartMetric(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    activeChartMetric === m
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <AreaChart
            data={timeseries}
            metricKey={activeChartMetric}
            metricLabel={
              activeChartMetric === 'reach'
                ? 'Daily Reach'
                : activeChartMetric === 'engagement'
                ? 'Engagements'
                : 'Video Views'
            }
            color={
              activeChartMetric === 'reach'
                ? '#2563eb'
                : activeChartMetric === 'engagement'
                ? '#ec4899'
                : '#8b5cf6'
            }
            height={260}
          />
        </div>

        {/* Engagement Share Donut */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Engagement Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-6">Audience interaction share by channel</p>

            <DonutChart items={donutItems} totalLabel="Engagements" />
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Primary Driver:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Instagram Reels (44.8%)
            </span>
          </div>
        </div>
      </div>

      {/* Platform Comparison & Activity Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Platform Audience Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative reach across Facebook, Instagram, TikTok, and YouTube
            </p>
          </div>

          <PlatformComparisonChart
            platforms={platformMetrics}
            metricKey="reach"
            metricLabel="Total Reach"
          />
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Publishing Frequency by Day
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Posts published per day during the selected period
            </p>
          </div>

          <BarChart
            data={timeseries}
            metricKey="postsPublished"
            metricLabel="Posts Published"
            color="#3b82f6"
            height={200}
          />
        </div>
      </div>

      {/* Performance by Platform Cards (Facebook, Instagram, TikTok, YouTube) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Performance by Platform
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Individual channel statistics and monthly engagement metrics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformMetrics.map((p) => (
            <PlatformMetricCard key={p.platform} metrics={p} />
          ))}
        </div>
      </div>

      {/* Top Performing Content Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Top Performing Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Highest engagement rates, viral reach, and view velocity
            </p>
          </div>
        </div>

        <TopContentTable posts={topPosts} />
      </div>
        </>
      )}
    </div>
  );
}
