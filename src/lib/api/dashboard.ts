/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "./api";

export interface DashboardStats {
  total: number;
  available: number;
  rented: number;
  maintenance: number;
}

export interface QuickStats {
  monthlyRevenue: number;
  occupancyRate: number;
  pendingApplications: number;
  maintenanceRequests: number;
  totalTenants: number;
}

export interface RecentActivity {
  id: string;
  type: 'application' | 'booking' | 'maintenance' | 'payment' | 'system';
  title: string;
  description: string;
  timestamp: string;
  propertyId: string;
  userId?: string;
  read: boolean;
}

export interface RecentProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  status: string;
  image: string;
  lastUpdated: string;
}

export interface DashboardData {
  stats: DashboardStats;
  quickStats: QuickStats;
  recentActivities: RecentActivity[];
  recentProperties: RecentProperty[];
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  propertyId: string;
  userId: string;
  assignedTo?: string;
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard API
export const dashboardApi = {
  // Get dashboard data
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/dashboard');
    return response.data.data;
  },

  // Get dashboard stats
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  // Get unread activities count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/dashboard/unread-count');
    return response.data.data;
  },

  // Activity APIs
  markActivityAsRead: async (activityId: string): Promise<{ success: boolean }> => {
    const response = await api.patch(`/dashboard/activities/${activityId}/read`);
    return response.data.data;
  },

  markAllActivitiesAsRead: async (): Promise<{ updatedCount: number }> => {
    const response = await api.patch('/dashboard/activities/read-all');
    return response.data.data;
  },

  getActivities: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    read?: boolean;
  }): Promise<{
    activities: RecentActivity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> => {
    const response = await api.get('/dashboard/activities', { params });
    return response.data.data;
  },

  getUnreadActivities: async (limit?: number): Promise<RecentActivity[]> => {
    const response = await api.get('/dashboard/activities/unread', {
      params: { limit }
    });
    return response.data.data;
  },

  deleteActivity: async (activityId: string): Promise<void> => {
    await api.delete(`/dashboard/activities/${activityId}`);
  },

  // Maintenance APIs
  getMaintenanceRequests: async (params?: {
    propertyId?: string;
    status?: string;
    priority?: string;
  }): Promise<MaintenanceRequest[]> => {
    const response = await api.get('/dashboard/maintenance', { params });
    return response.data.data;
  },

  getMaintenanceStats: async (propertyId?: string): Promise<any> => {
    const response = await api.get('/dashboard/maintenance/stats', {
      params: { propertyId }
    });
    return response.data.data;
  },

  getPendingRequests: async (propertyId?: string): Promise<MaintenanceRequest[]> => {
    const response = await api.get('/dashboard/maintenance/pending', {
      params: { propertyId }
    });
    return response.data.data;
  },

  getMaintenanceRequest: async (maintenanceId: string): Promise<MaintenanceRequest> => {
    const response = await api.get(`/dashboard/maintenance/${maintenanceId}`);
    return response.data.data;
  },

  createMaintenanceRequest: async (data: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    propertyId: string;
    images?: string[];
    scheduledDate?: string;
    costEstimate?: number;
  }): Promise<MaintenanceRequest> => {
    const response = await api.post('/dashboard/maintenance', data);
    return response.data.data;
  },

  updateMaintenanceStatus: async (
    maintenanceId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<MaintenanceRequest> => {
    const response = await api.patch(`/dashboard/maintenance/${maintenanceId}/status`, { status });
    return response.data.data;
  },

  assignMaintenance: async (maintenanceId: string, assignedTo: string): Promise<MaintenanceRequest> => {
    const response = await api.patch(`/dashboard/maintenance/${maintenanceId}/assign`, { assignedTo });
    return response.data.data;
  },

  updateMaintenanceRequest: async (
    maintenanceId: string,
    data: Partial<{
      title: string;
      description: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      category: string;
      images: string[];
      scheduledDate: string;
      costEstimate: number;
      actualCost: number;
    }>
  ): Promise<MaintenanceRequest> => {
    const response = await api.put(`/dashboard/maintenance/${maintenanceId}`, data);
    return response.data.data;
  },

  deleteMaintenanceRequest: async (maintenanceId: string): Promise<void> => {
    await api.delete(`/dashboard/maintenance/${maintenanceId}`);
  },
};