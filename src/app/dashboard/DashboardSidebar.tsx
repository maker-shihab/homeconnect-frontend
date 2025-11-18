'use client';

import { pacifico } from '@/lib/fonts';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  TbBuilding,
  TbChartBar,
  TbChevronDown,
  TbChevronRight,
  TbCreditCard,
  TbFileText,
  TbHeart,
  TbHelp,
  TbHome,
  TbHomeSearch,
  TbLogout,
  TbMessage,
  TbSettings,
  TbShield,
  TbUser,
  TbUsers
} from 'react-icons/tb';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'tenant' | 'landlord' | 'admin' | 'support';
}

// Role-based menu configuration
const menuConfig = {
  tenant: [
    {
      type: 'link',
      href: '/dashboard',
      label: 'Dashboard',
      icon: TbChartBar,
      badge: null
    },
    {
      type: 'link',
      href: '/dashboard/search',
      label: 'Find Properties',
      icon: TbHomeSearch,
      badge: null
    },
    {
      type: 'dropdown',
      label: 'My Rentals',
      icon: TbHome,
      items: [
        { href: '/dashboard/my-rentals', label: 'Current Rentals' },
        { href: '/dashboard/rental-history', label: 'Rental History' },
        { href: '/dashboard/lease-agreements', label: 'Lease Agreements' },
      ]
    },
    {
      type: 'link',
      href: '/dashboard/payments',
      label: 'Payments',
      icon: TbCreditCard,
      badge: null
    },
    {
      type: 'link',
      href: '/dashboard/favorites',
      label: 'Favorites',
      icon: TbHeart,
      badge: null
    },
    {
      type: 'link',
      href: '/dashboard/messages',
      label: 'Messages',
      icon: TbMessage,
      badge: '5'
    },
    {
      type: 'link',
      href: '/dashboard/support',
      label: 'Support',
      icon: TbHelp,
      badge: null
    }
  ],
  landlord: [
    {
      type: 'link',
      href: '/dashboard',
      label: 'Overview',
      icon: TbChartBar,
      badge: null
    },
    {
      type: 'dropdown',
      label: 'Properties',
      icon: TbBuilding,
      items: [
        { href: '/dashboard/properties', label: 'All Properties' },
        { href: '/dashboard/add-property', label: 'Add New Property' },
        { href: '/dashboard/property-tours', label: 'Property Tours' },
      ]
    },
    {
      type: 'dropdown',
      label: 'Tenants',
      icon: TbUsers,
      items: [
        { href: '/dashboard/tenants', label: 'Manage Tenants' },
        { href: '/dashboard/tenant-applications', label: 'Applications' },
        { href: '/dashboard/tenant-screening', label: 'Tenant Screening' },
      ]
    },
    {
      type: 'dropdown',
      label: 'Finances',
      icon: TbCreditCard,
      items: [
        { href: '/dashboard/rent-collection', label: 'Rent Collection' },
        { href: '/dashboard/expenses', label: 'Expenses' },
        { href: '/dashboard/reports', label: 'Financial Reports' },
      ]
    },
    {
      type: 'link',
      href: '/dashboard/maintenance',
      label: 'Maintenance',
      icon: TbSettings,
      badge: '3'
    },
    {
      type: 'link',
      href: '/dashboard/messages',
      label: 'Messages',
      icon: TbMessage,
      badge: '12'
    },
    {
      type: 'link',
      href: '/dashboard/lease-templates',
      label: 'Lease Templates',
      icon: TbFileText,
      badge: null
    }
  ],
  admin: [
    {
      type: 'link',
      href: '/dashboard',
      label: 'Admin Dashboard',
      icon: TbChartBar,
      badge: null
    },
    {
      type: 'dropdown',
      label: 'User Management',
      icon: TbUsers,
      items: [
        { href: '/dashboard/admin/users', label: 'All Users' },
        { href: '/dashboard/admin/landlords', label: 'Landlords' },
        { href: '/dashboard/admin/tenants', label: 'Tenants' },
        { href: '/dashboard/admin/staff', label: 'Staff Members' },
      ]
    },
    {
      type: 'dropdown',
      label: 'Properties',
      icon: TbBuilding,
      items: [
        { href: '/dashboard/admin/properties', label: 'All Properties' },
        { href: '/dashboard/admin/verification', label: 'Property Verification' },
        { href: '/dashboard/admin/categories', label: 'Categories & Types' },
      ]
    },
    {
      type: 'dropdown',
      label: 'Financial',
      icon: TbCreditCard,
      items: [
        { href: '/dashboard/admin/transactions', label: 'All Transactions' },
        { href: '/dashboard/admin/commissions', label: 'Commissions' },
        { href: '/dashboard/admin/reports', label: 'Financial Reports' },
      ]
    },
    {
      type: 'link',
      href: '/dashboard/admin/site-settings',
      label: 'Site Settings',
      icon: TbSettings,
      badge: null
    },
    {
      type: 'link',
      href: '/dashboard/admin/support',
      label: 'Support Center',
      icon: TbHelp,
      badge: '25'
    },
    {
      type: 'link',
      href: '/dashboard/admin/analytics',
      label: 'Analytics',
      icon: TbChartBar,
      badge: null
    }
  ],
  support: [
    {
      type: 'link',
      href: '/dashboard',
      label: 'Support Dashboard',
      icon: TbChartBar,
      badge: null
    },
    {
      type: 'link',
      href: '/dashboard/support/tickets',
      label: 'Support Tickets',
      icon: TbMessage,
      badge: '15'
    },
    {
      type: 'link',
      href: '/dashboard/support/live-chat',
      label: 'Live Chat',
      icon: TbUsers,
      badge: '3'
    },
    {
      type: 'dropdown',
      label: 'Help Center',
      icon: TbHelp,
      items: [
        { href: '/dashboard/support/knowledge-base', label: 'Knowledge Base' },
        { href: '/dashboard/support/faqs', label: 'FAQs Management' },
        { href: '/dashboard/support/guides', label: 'User Guides' },
      ]
    },
    {
      type: 'link',
      href: '/dashboard/support/escalations',
      label: 'Escalated Issues',
      icon: TbShield,
      badge: '7'
    },
    {
      type: 'link',
      href: '/dashboard/support/feedback',
      label: 'User Feedback',
      icon: TbHeart,
      badge: null
    }
  ]
};

export default function DashboardSidebar({ isOpen, onClose, role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const toggleDropdown = (label: string) => {
    const newDropdowns = new Set(openDropdowns);
    if (newDropdowns.has(label)) {
      newDropdowns.delete(label);
    } else {
      newDropdowns.add(label);
    }
    setOpenDropdowns(newDropdowns);
  };

  const menuItems = menuConfig[role];

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
        "fixed h-full inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-white to-gray-50/80 shadow-2xl border-r border-gray-200/60 backdrop-blur-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Enhanced Logo Section */}
        <div className="flex items-center justify-between h-24 p-6 border-b border-gray-200/40 bg-white/50 backdrop-blur-sm">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg hover:drop-shadow-xl inline-flex items-center space-x-4 hover:scale-105 transition-all duration-300">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                <TbHomeSearch className="text-xl text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className={`${pacifico.className}`}>HomeConnect</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              const isDropdownOpen = openDropdowns.has(item.label);

              if (item.type === 'dropdown') {
                return (
                  <div key={item.label} className="rounded-xl transition-all duration-200 hover:bg-white/50">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className="flex items-center justify-between w-full px-4 py-4 text-sm font-semibold text-gray-700 rounded-xl hover:text-gray-900 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <IconComponent className="w-5 h-5 mr-3 text-blue-600" />
                        {item.label}
                      </div>
                      {isDropdownOpen ? (
                        <TbChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                      ) : (
                        <TbChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                      )}
                    </button>

                    {isDropdownOpen && (
                      <div className="ml-4 pl-8 border-l-2 border-gray-200/40 space-y-1 py-2">
                        {item.items?.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-200"
                            onClick={() => window.innerWidth < 1024 && onClose()}
                          >
                            <TbChevronRight className="w-3 h-3 mr-2" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href || '#'}
                  className={clsx(
                    "flex items-center justify-between px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-600 border-r-4 border-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-white/80 hover:text-gray-900 hover:shadow-md"
                  )}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                >
                  <div className="flex items-center">
                    <IconComponent className={clsx(
                      "w-5 h-5 mr-3 transition-colors duration-200",
                      isActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-500"
                    )} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className={clsx(
                      "px-2 py-1 text-xs font-bold rounded-full min-w-6 text-center",
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-600"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Enhanced Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/40 bg-white/50 backdrop-blur-sm">
          <div className="space-y-3">
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-blue-300/10 hover:text-gray-900 transition-all duration-200 group"
            >
              <TbUser className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-500" />
              My Profile
            </Link>
            <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50/80 transition-all duration-200 group">
              <TbLogout className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}