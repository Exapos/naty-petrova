import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsOverview } from './AnalyticsOverview';
import { TopPages } from './TopPages';
import { TrafficSources } from './TrafficSources';
import { WebVitalsAnalytics } from './WebVitalsAnalytics';
import { RealTimeMetrics } from './RealTimeMetrics';
import { Conversions } from './Conversions';
import { GeographicData } from './GeographicData';
import { DeviceBrowserBreakdown } from './DeviceBrowserBreakdown';
import { PerformanceMetrics } from './PerformanceMetrics';
import { DailyChart } from './DailyChart';

const TIME_PERIODS = [
  { value: 7, label: 'Posledních 7 dní' },
  { value: 30, label: 'Posledních 30 dní' },
  { value: 90, label: 'Posledních 90 dní' },
] as const;

export function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const { data, loading, error, isRealData, refetch } = useAnalytics(selectedPeriod);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mb-2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mb-1" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-4" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-full w-32 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Chyba při načítání analytics dat
            </h3>
            <p className="text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          </div>
        </div>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Zkusit znovu
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Žádná analytics data nejsou k dispozici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header s ovládacími prvky */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Google Analytics Dashboard
          </h2>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${isRealData ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRealData ? 'Reálná data z Google Analytics' : 'Demo data (GA není nakonfigurována)'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TIME_PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Obnovit</span>
          </button>
        </div>
      </div>

      {/* Real-time a konverze */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RealTimeMetrics realTimeUsers={data.realTimeUsers} />
        <Conversions conversions={data.conversions} className="lg:col-span-2" />
      </div>

      {/* Přehled metrik */}
      <AnalyticsOverview data={data} />

      {/* Denní trendy */}
      <DailyChart dailyData={data.dailyData} />

      {/* Web Vitals sekce */}
      <WebVitalsAnalytics days={selectedPeriod} />

      {/* Detailní statistiky */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopPages data={data.topPages} />
        <TrafficSources data={data.trafficSources} />
      </div>

      {/* Geografická data a zařízení/prohlížeče */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GeographicData countries={data.countries} />
        <DeviceBrowserBreakdown devices={data.devices} browsers={data.browsers} />
      </div>

      {/* Performance metriky */}
      <PerformanceMetrics performance={data.performance} />

      {/* Informace o datech */}
      {!isRealData && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Zobrazujete demo data
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Pro zobrazení reálných dat dokončete nastavení Google Analytics podle návodu v GA4_SETUP.md
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}