'use client';
import React, { useState, useEffect } from 'react';
import { useWebVitals } from '@/hooks/useWebVitals';

interface WebVitalsAnalyticsProps {
  className?: string;
  days?: number;
}

const TIME_PERIODS = [
  { value: 7, label: 'Posledních 7 dní' },
  { value: 30, label: 'Posledních 30 dní' },
  { value: 90, label: 'Posledních 90 dní' },
] as const;

export function WebVitalsAnalytics({ className = '', days = 30 }: WebVitalsAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(days);
  const { data, loading, error, refetch, isRealData, totalSamples } = useWebVitals(selectedPeriod);

  // Synchronizace s parent komponentou
  useEffect(() => {
    setSelectedPeriod(days);
  }, [days]);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Chyba při načítání Web Vitals dat
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

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'needs-improvement':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRatingBg = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'needs-improvement':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'poor':
        return 'bg-red-100 dark:bg-red-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatValue = (name: string, value: number) => {
    switch (name) {
      case 'CLS':
        return value.toFixed(4);
      case 'FID':
      case 'INP':
        return `${value.toFixed(0)} ms`;
      case 'FCP':
      case 'LCP':
      case 'TTFB':
        return `${value.toFixed(0)} ms`;
      default:
        return value.toString();
    }
  };

  const getMetricInfo = (name: string) => {
    const infos = {
      CLS: {
        title: 'Cumulative Layout Shift',
        description: 'Míra posunu layoutu během načítání',
        good: '< 0.1',
        poor: '> 0.25'
      },
      FID: {
        title: 'First Input Delay',
        description: 'Čas od první interakce do odezvy',
        good: '< 100 ms',
        poor: '> 300 ms'
      },
      FCP: {
        title: 'First Contentful Paint',
        description: 'Čas do zobrazení prvního obsahu',
        good: '< 1800 ms',
        poor: '> 3000 ms'
      },
      LCP: {
        title: 'Largest Contentful Paint',
        description: 'Čas do načtení největšího prvku',
        good: '< 2500 ms',
        poor: '> 4000 ms'
      },
      TTFB: {
        title: 'Time to First Byte',
        description: 'Čas do přijetí prvního bytu',
        good: '< 800 ms',
        poor: '> 1800 ms'
      }
    };
    return infos[name as keyof typeof infos] || { title: name, description: '', good: '', poor: '' };
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Core Web Vitals
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Výkon stránky podle Google metrik
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TIME_PERIODS.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          <button
            onClick={refetch}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            Obnovit
          </button>
        </div>
      </div>

      {!data || data.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">
            Žádná Web Vitals data nejsou k dispozici
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Data se začnou sbírat automaticky při návštěvách webu (vyžaduje souhlas s cookies)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((metric, index) => {
            const info = getMetricInfo(metric.name);
            return (
              <div
                key={`${metric.name}-${index}`}
                className={`p-4 rounded-lg border ${getRatingBg(metric.rating)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {info.title}
                  </h4>
                  <span className={`text-sm font-medium ${getRatingColor(metric.rating)}`}>
                    {metric.rating === 'good' ? 'Dobré' :
                     metric.rating === 'needs-improvement' ? 'Vyžaduje zlepšení' : 'Špatné'}
                  </span>
                </div>

                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatValue(metric.name, metric.value)}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {info.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span>Dobré: {info.good} | Špatné: {info.poor}</span>
                  {metric.sampleSize && (
                    <span className="text-gray-400">({metric.sampleSize} vzorků)</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Informace o datech */}
      {isRealData && totalSamples > 0 && (
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200">
                Reálná data z vašeho webu
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Zobrazujete data z {totalSamples} měření za posledních {selectedPeriod} dní
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Data z posledních {selectedPeriod} dní • Sbírána automaticky z návštěv webu
          </span>
          <a
            href="https://developers.google.com/search/docs/appearance/core-web-vitals"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Více o Core Web Vitals →
          </a>
        </div>
      </div>
    </div>
  );
}