'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChartBarIcon, GlobeAltIcon, ExclamationTriangleIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítání...</p>
        </div>
      </div>
    );
  }

  // Access denied
  if (!session || session.user?.role !== 'ADMIN') {
    return null; // Přesměrování už proběhlo
  }
  
  // Google Analytics Configuration
  const GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  const isGAConfigured = GOOGLE_ANALYTICS_ID && GOOGLE_ANALYTICS_ID !== 'G-XXXXXXXXXX';
  
  const tabs = [
    { id: 'overview', name: 'Přehled', icon: ChartBarIcon },
    { id: 'realtime', name: 'Realtime', icon: GlobeAltIcon },
    { id: 'devices', name: 'Zařízení', icon: DevicePhoneMobileIcon },
  ];





  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'realtime':
        return renderRealtimeTab();
      case 'devices':
        return renderDevicesTab();
      default:
        return renderOverviewTab();
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Google Analytics Embed */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Google Analytics Dashboard</h3>
          <p className="text-sm text-gray-500 mt-1">
            Detailní přehled návštěvnosti z Google Analytics
          </p>
        </div>
        
        <div className="p-6">
          {!isGAConfigured ? (
            // Pokud není nastaveno GA ID, zobrazí se instrukce
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Google Analytics není nakonfigurováno</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                Pro zobrazení Google Analytics dat je potřeba:
              </p>
              <div className="mt-4 text-left max-w-lg mx-auto space-y-2 text-sm text-gray-600">
                <p>1. Vytvořit Google Analytics účet a získat Measurement ID</p>
                <p>2. Přidat <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> do .env</p>
                <p>3. Nastavit oprávnění pro GA4 Reporting API</p>
              </div>
              <div className="mt-6">
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Otevřít Google Analytics
                </a>
              </div>
            </div>
          ) : (
            // Zde by byl skutečný Google Analytics embed
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <ChartBarIcon className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Google Analytics Dashboard
                </h3>
                <p className="text-gray-600 mb-4">
                  GA ID nakonfigurováno: {GOOGLE_ANALYTICS_ID}
                </p>
                <p className="text-sm text-gray-500">
                  Data se zobrazí po implementaci GA4 Reporting API
                </p>
              </div>
              
              <div className="text-center">
                <a
                  href="https://analytics.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <GlobeAltIcon className="w-5 h-5 mr-2" />
                  Otevřít v Google Analytics
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popular Pages & Referrers */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Populární stránky</h3>
          <div className="space-y-3">
            {[
              { page: '/o-nas', views: '---', percentage: '---' },
              { page: '/sluzby', views: '---', percentage: '---' },
              { page: '/reference', views: '---', percentage: '---' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.page}</p>
                  <p className="text-xs text-gray-500">{item.views} zobrazení</p>
                </div>
                <div className="text-sm text-gray-500">{item.percentage}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Zdroje návštěvnosti</h3>
          <div className="space-y-3">
            {[
              { source: 'Organické vyhledávání', visitors: '---', percentage: '---' },
              { source: 'Přímá návštěva', visitors: '---', percentage: '---' },
              { source: 'Sociální sítě', visitors: '---', percentage: '---' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.source}</p>
                  <p className="text-xs text-gray-500">{item.visitors} návštěvníků</p>
                </div>
                <div className="text-sm text-gray-500">{item.percentage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderRealtimeTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Realtime Analytics</h3>
        <p className="text-sm text-gray-500 mt-1">
          Živé data o návštěvnících na webu
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">---</div>
              <div className="text-sm text-blue-600">Aktivní uživatelé</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">---</div>
              <div className="text-sm text-green-600">Zobrazení za minutu</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">---</div>
              <div className="text-sm text-purple-600">Nové relace</div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Aktivní stránky</h4>
            <div className="space-y-3">
              {['/o-nas', '/sluzby', '/reference'].map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-900">{page}</span>
                  <span className="text-sm text-gray-500">--- uživatelů</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDevicesTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Analýza zařízení</h3>
        <p className="text-sm text-gray-500 mt-1">
          Přehled zařízení a prohlížečů návštěvníků
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Typy zařízení</h4>
            <div className="space-y-3">
              {[
                { device: 'Desktop', percentage: '---', count: '---' },
                { device: 'Mobile', percentage: '---', count: '---' },
                { device: 'Tablet', percentage: '---', count: '---' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.device}</p>
                    <p className="text-xs text-gray-500">{item.count} návštěv</p>
                  </div>
                  <div className="text-sm text-gray-500">{item.percentage}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Prohlížeče</h4>
            <div className="space-y-3">
              {[
                { browser: 'Chrome', percentage: '---', count: '---' },
                { browser: 'Safari', percentage: '---', count: '---' },
                { browser: 'Firefox', percentage: '---', count: '---' },
                { browser: 'Edge', percentage: '---', count: '---' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.browser}</p>
                    <p className="text-xs text-gray-500">{item.count} návštěv</p>
                  </div>
                  <div className="text-sm text-gray-500">{item.percentage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Přehled návštěvnosti a používání webu</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>



      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}