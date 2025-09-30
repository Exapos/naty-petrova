'use client';
import React from 'react';

interface PerformanceMetricsProps {
  performance: {
    avgPageLoadTime: number;
    errorRate: number;
    exitRate: number;
  };
  className?: string;
}

export function PerformanceMetrics({ performance, className = '' }: PerformanceMetricsProps) {
  const hasData = performance.avgPageLoadTime > 0 || performance.errorRate > 0 || performance.exitRate > 0;

  if (!hasData) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Výkon webu
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Metriky výkonu a kvality
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Žádná data k dispozici</p>
        </div>
      </div>
    );
  }
  const metrics = [
    {
      label: 'Průměrný čas načtení',
      value: `${performance.avgPageLoadTime.toFixed(1)}s`,
      status: performance.avgPageLoadTime < 3 ? 'good' : performance.avgPageLoadTime < 5 ? 'warning' : 'poor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Chybovost',
      value: `${(performance.errorRate * 100).toFixed(1)}%`,
      status: performance.errorRate < 0.05 ? 'good' : performance.errorRate < 0.1 ? 'warning' : 'poor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
    {
      label: 'Opuštění stránky',
      value: `${(performance.exitRate * 100).toFixed(1)}%`,
      status: performance.exitRate < 0.4 ? 'good' : performance.exitRate < 0.6 ? 'warning' : 'poor',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'poor':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'poor':
        return 'bg-red-100 dark:bg-red-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Výkon webu
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Metriky výkonu a kvality
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getStatusBg(metric.status)}`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${getStatusColor(metric.status)}`}>
                {metric.icon}
              </div>
              <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                {metric.status === 'good' ? 'Dobré' :
                 metric.status === 'warning' ? 'Vyžaduje pozornost' : 'Špatné'}
              </span>
            </div>

            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {metric.value}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metric.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}