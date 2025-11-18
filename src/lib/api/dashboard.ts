import { api } from "./api";

export interface IActivityResponse {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  message: string;
  createdAt: string;
}

export interface IMaintenanceRequestResponse {
  id: string;
  property: {
    id: string;
    title: string;
    address: string;
  };
  tenant: {
    id: string;
    name: string;
  };
  title: string;
  description: string;
  status: string;
  priority: string;
  images?: string[];
  reportedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface IDashboardStats {
  totalProperties: number;
  totalPropertiesForRent: number;
  totalPropertiesForSale: number;
  occupiedProperties: number;
  totalUsers: number;
  totalLandlords: number;
  pendingMaintenance: number;
  totalRevenue: number;
}

export interface IDashboardOverviewResponse {
  stats: IDashboardStats;
  recentActivity: IActivityResponse[];
  pendingMaintenanceRequests: IMaintenanceRequestResponse[];
}
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: TUserRole;
  avatar?: string | null;
  phone?: string;
}
export type TUserRole = 'tenant' | 'landlord' | 'admin' | 'support';
// --- Dashboard API Service ---

export const dashboardApi = {
  /**
   * Get dashboard overview data based on user role
   */
  getDashboard: async (): Promise<IDashboardOverviewResponse> => {
    const response = await api.get('/dashboard/overview');
    return response.data.data; // Matches the backend structure
  },

  /**
   * Get all maintenance requests (can be filtered)
   */
  getMaintenanceRequests: async (params?: {
    status?: string;
    priority?: string;
    propertyId?: string;
    tenantId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    requests: IMaintenanceRequestResponse[];
    total: number;
    totalPages: number;
  }> => {
    const response = await api.get('/dashboard/maintenance', { params });
    return response.data.data;
  },

  /**
   * Update a maintenance request
   */
  updateMaintenanceRequest: async (
    maintenanceId: string,
    data: { status?: string; priority?: string }
  ): Promise<IMaintenanceRequestResponse> => {
    const response = await api.patch(`/dashboard/maintenance/${maintenanceId}`, data);
    return response.data.data;
  },

  /**
   * Get all activities (can be filtered)
   */
  getActivities: async (params?: {
    action?: string;
    userId?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    activities: IActivityResponse[];
    total: number;
    totalPages: number;
  }> => {
    const response = await api.get('/dashboard/activity', { params });
    return response.data.data;
  },
};