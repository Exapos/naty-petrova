'use client';
import React from 'react';

interface GeographicDataProps {
  countries: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  className?: string;
}

export function GeographicData({ countries, className = '' }: GeographicDataProps) {
  if (!countries || countries.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Geografické rozložení
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Návštěvníci podle zemí
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Žádná data k dispozici</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Geografické rozložení
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Návštěvníci podle zemí
        </p>
      </div>

      <div className="space-y-4">
        {countries.map((country, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
                {country.country.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {country.country}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {country.users} uživatelů
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {country.percentage}%
              </div>
              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${country.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}