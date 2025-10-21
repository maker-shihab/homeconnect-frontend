'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { Link } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">
                  {user?.role === 'landlord' ? 'Property Owner Dashboard' : 'Tenant Dashboard'}
                </p>
              </div>
              <Button onClick={logout} variant="outline">
                Logout
              </Button>
            </div>



            {/* Quick Add Property Form (or link to full form) */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="flex gap-4">
                <Link href="/properties/add">
                  <Button>Add New Property</Button>
                </Link>
                <Link href="/properties">
                  <Button variant="outline">View All Properties</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}