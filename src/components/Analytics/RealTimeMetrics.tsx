'use client';
import React from 'react';

interface RealTimeMetricsProps {
  realTimeUsers: number;
  className?: string;
}

export function RealTimeMetrics({ realTimeUsers, className = '' }: RealTimeMetricsProps) {
  if (realTimeUsers === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Real-time aktivita
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aktuální návštěvníci na webu
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Žádná data</span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-gray-400 dark:text-gray-500 mb-2">
            ---
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            žádní aktivní uživatelé
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Real-time aktivita
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Aktuální návštěvníci na webu
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Live</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {realTimeUsers}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          aktivních uživatelů
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Aktualizace každých 30 sekund</span>
          <span>Poslední update: {new Date().toLocaleTimeString('cs-CZ')}</span>
        </div>
      </div>
    </div>
  );
}