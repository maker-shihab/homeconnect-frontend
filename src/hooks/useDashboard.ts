// hooks/useDashboard.ts
'use client';

import { dashboardApi } from '@/lib/api/dashboard';
import { useQuery } from '@tanstack/react-query';

export const useDashboard = () => {
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: dashboardApi.getStats,
  });

  const quickStatsQuery = useQuery({
    queryKey: ['dashboard', 'quick-stats'],
    queryFn: dashboardApi.getQuickStats,
  });

  const activitiesQuery = useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: dashboardApi.getRecentActivities,
  });

  const propertiesQuery = useQuery({
    queryKey: ['dashboard', 'properties'],
    queryFn: dashboardApi.getRecentProperties,
  });

  return {
    stats: statsQuery.data,
    quickStats: quickStatsQuery.data,
    activities: activitiesQuery.data,
    properties: propertiesQuery.data,
    isLoading: statsQuery.isLoading || quickStatsQuery.isLoading || activitiesQuery.isLoading || propertiesQuery.isLoading,
    error: statsQuery.error || quickStatsQuery.error || activitiesQuery.error || propertiesQuery.error,
  };
};