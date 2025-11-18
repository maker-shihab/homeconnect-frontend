"use client";

import { dashboardApi } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDashboard = () => {
  const overviewQuery = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: dashboardApi.getDashboard,
  });

  const stats = overviewQuery.data?.stats;
  const activities = overviewQuery.data?.recentActivity ?? [];
  const properties = overviewQuery.data?.pendingMaintenanceRequests ?? [];

  return {
    stats,
    quickStats: stats,
    activities,
    properties,
    isLoading: overviewQuery.isLoading,
    error: overviewQuery.error,
  };
};
