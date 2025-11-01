'use client';

import { pacifico } from '@/lib/fonts';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TbHomeSearch } from 'react-icons/tb';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/properties', label: 'Properties', icon: '🏠' },
  { href: '/dashboard/add-property', label: 'Add Property', icon: '➕' },
  { href: '/dashboard/messages', label: 'Messages', icon: '💬' },
  { href: '/dashboard/favorites', label: 'Favorites', icon: '❤️' },
  { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed h-full inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed h-full inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-20 p-6 border-b border-gray-200">
          <Link
            href="/"
            className={`${pacifico.className} text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg hover:drop-shadow-xl inline-flex items-center space-x-3 hover:scale-105 transition-transform duration-300`}
          >
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-200/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <span className="text-xl text-blue-600 lg:text-2xl"><TbHomeSearch /></span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <span className="none md:block">HomeConnect</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}