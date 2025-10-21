'use client';

import DashboardLayout from '@/app/dashboard/DashboardLayout';
import { usePathname } from 'next/navigation';
import Footer from './footer';
import Header from './header';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if current route is dashboard or auth pages
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuthPage = pathname?.startsWith('/signin') || pathname?.startsWith('/signup');

  // Don't show header/footer for dashboard and auth pages
  if (isDashboard) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}