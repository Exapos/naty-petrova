'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnalyticsDashboard } from '@/components/Analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Kontrola oprávnění - pouze admin má přístup k analytics
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/admin/dashboard');
      return;
    }
  }, [session, status, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Načítání...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!session || session.user?.role !== 'ADMIN') {
    return null; // Přesměrování už proběhlo
  }

  return <AnalyticsDashboard />;
}
