// lib/api/dashboard.ts
import { Property, PropertyStats, QuickStats, RecentActivity } from '@/types/dashboard';

export const dashboardApi = {
  async getStats(): Promise<PropertyStats> {
    const response = await fetch('http://localhost:5000/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  },

  async getQuickStats(): Promise<QuickStats> {
    const response = await fetch('http://localhost:5000/api/dashboard/quick-stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quick stats');
    }

    return response.json();
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    const response = await fetch('http://localhost:5000/api/dashboard/activities', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch activities');
    }

    return response.json();
  },

  async getRecentProperties(): Promise<Property[]> {
    const response = await fetch('http://localhost:5000/api/dashboard/recent-properties', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }

    return response.json();
  },
};