'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardApi, DashboardData } from '@/lib/api/dashboard';
import { useAuth } from '@/lib/auth-context';
import { CalendarIcon, ChartBarIcon, Eye, EyeIcon, LinkIcon, PlusIcon, WrenchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (activityId: string) => {
    try {
      setMarkingRead(activityId);
      await dashboardApi.markActivityAsRead(activityId);

      // Update local state
      setDashboardData(prev => prev ? {
        ...prev,
        recentActivities: prev.recentActivities.map(activity =>
          activity.id === activityId ? { ...activity, read: true } : activity
        )
      } : null);
    } catch (error) {
      console.error('Failed to mark activity as read:', error);
    } finally {
      setMarkingRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dashboardApi.markAllActivitiesAsRead();

      // Update local state
      setDashboardData(prev => prev ? {
        ...prev,
        recentActivities: prev.recentActivities.map(activity => ({
          ...activity,
          read: true
        }))
      } : null);
    } catch (error) {
      console.error('Failed to mark all activities as read:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'rented': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'occupied': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application': return '📝';
      case 'booking': return '✅';
      case 'maintenance': return '🔧';
      case 'payment': return '💰';
      case 'system': return '⚙️';
      default: return '📌';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <Button onClick={fetchDashboardData}>
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.role === 'landlord' ? 'Property Management Dashboard' : 'Tenant Dashboard'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {user?.role === 'landlord' && (
                <Link href="/properties/add">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Add New Property
                  </Button>
                </Link>
              )}
              <Link href="/properties">
                <Button variant="outline" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  View Properties
                </Button>
              </Link>
            </div>
          </div>

          {dashboardData && (
            <div className="space-y-6">
              {/* Property Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Properties"
                  value={dashboardData.stats.total.toString()}
                  description="All your properties"
                  icon="🏠"
                />
                <StatCard
                  title="Available"
                  value={dashboardData.stats.available.toString()}
                  description="Ready to rent"
                  icon="🟢"
                  trend="positive"
                />
                <StatCard
                  title="Rented"
                  value={dashboardData.stats.rented.toString()}
                  description="Currently occupied"
                  icon="🔑"
                />
                <StatCard
                  title="Maintenance"
                  value={dashboardData.stats.maintenance.toString()}
                  description="Needs attention"
                  icon="🔧"
                  trend="negative"
                />
              </div>

              {/* Quick Stats & Revenue */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Key metrics for your properties</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(dashboardData.quickStats.monthlyRevenue)}
                        </p>
                        <p className="text-xs text-gray-500">Current month</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {dashboardData.quickStats.occupancyRate}%
                        </p>
                        <p className="text-xs text-gray-500">Properties occupied</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {dashboardData.quickStats.pendingApplications}
                        </p>
                        <p className="text-xs text-gray-500">Awaiting review</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Maintenance Requests</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {dashboardData.quickStats.maintenanceRequests}
                        </p>
                        <p className="text-xs text-gray-500">Needs attention</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tenant Information</CardTitle>
                    <CardDescription>Current tenant stats</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-gray-900 mb-2">
                        {dashboardData.quickStats.totalTenants}
                      </p>
                      <p className="text-gray-600">Active Tenants</p>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-700">
                          {dashboardData.quickStats.occupancyRate}% occupancy rate
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities & Properties */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Activities</CardTitle>
                      <CardDescription>Latest updates and requests</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {dashboardData.recentActivities.some(activity => !activity.read) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMarkAllAsRead}
                          className="text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Mark All Read
                        </Button>
                      )}
                      <Link href="/dashboard/activities">
                        <Button variant="ghost" size="sm">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.recentActivities.slice(0, 6).map((activity) => (
                        <div
                          key={activity.id}
                          className={`flex items-start space-x-3 p-3 rounded-lg border ${!activity.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                            } transition-colors duration-200`}
                        >
                          <span className="text-lg mt-0.5 flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">
                              {activity.title}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                              {activity.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {!activity.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(activity.id)}
                              disabled={markingRead === activity.id}
                              className="text-xs text-blue-600 hover:text-blue-800 flex-shrink-0"
                            >
                              {markingRead === activity.id ? (
                                '...'
                              ) : (
                                <EyeIcon className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {dashboardData.recentActivities.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No recent activities</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Properties */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Properties</CardTitle>
                      <CardDescription>Your recently added properties</CardDescription>
                    </div>
                    <Link href="/properties">
                      <Button variant="ghost" size="sm">
                        View All
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardData.recentProperties.slice(0, 5).map((property) => (
                        <Link
                          key={property.id}
                          href={`/properties/${property.id}`}
                          className="block transition-transform hover:scale-[1.02]"
                        >
                          <div className="flex items-center space-x-4 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={property.image || '/default-property.jpg'}
                                alt={property.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/default-property.jpg';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {property.title}
                              </p>
                              <p className="text-gray-600 text-xs truncate">
                                {property.address}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <Badge
                                  variant="secondary"
                                  className={`${getStatusColor(property.status)} text-xs`}
                                >
                                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                </Badge>
                                <span className="text-sm font-semibold text-gray-900">
                                  {formatCurrency(property.price)}/mo
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {dashboardData.recentProperties.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">No properties added yet</p>
                        {user?.role === 'landlord' && (
                          <Link href="/properties/add">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              Add Your First Property
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your properties efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {user?.role === 'landlord' && (
                      <Link href="/properties/add">
                        <Button variant="outline" className="w-full h-16 flex-col gap-1">
                          <PlusIcon className="h-5 w-5" />
                          <span className="text-xs">Add Property</span>
                        </Button>
                      </Link>
                    )}
                    <Link href="/bookings">
                      <Button variant="outline" className="w-full h-16 flex-col gap-1">
                        <CalendarIcon className="h-5 w-5" />
                        <span className="text-xs">View Bookings</span>
                      </Button>
                    </Link>
                    <Link href="/dashboard/maintenance">
                      <Button variant="outline" className="w-full h-16 flex-col gap-1">
                        <WrenchIcon className="h-5 w-5" />
                        <span className="text-xs">Maintenance</span>
                      </Button>
                    </Link>
                    <Link href="/reports">
                      <Button variant="outline" className="w-full h-16 flex-col gap-1">
                        <ChartBarIcon className="h-5 w-5" />
                        <span className="text-xs">Reports</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  description,
  icon,
  trend
}: {
  title: string;
  value: string;
  description: string;
  icon: string;
  trend?: 'positive' | 'negative';
}) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
        {trend && (
          <div className={`mt-2 text-xs font-medium ${trend === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
            {trend === 'positive' ? '↑' : '↓'} Trending
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton Loader
function DashboardSkeleton() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>

            {/* Activities & Properties Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-16 w-full mb-4" />
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}