'use client';

import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50">
      {/* Sidebar - fixed full height */}
      <div className="fixed inset-y-0 left-0 z-50 min-h-screen h-full">
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full lg:ml-64">
        {/* Header */}
        <header className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200 h-20 z-40 sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left: Mobile menu */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900 lg:ml-0">
                Dashboard
              </h1>
            </div>

            {/* Right: Profile + Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.email || 'user@example.com'}
                  </span>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <span className="text-white text-sm font-medium">
                    {(user?.name?.[0] || 'U').toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Logout"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
