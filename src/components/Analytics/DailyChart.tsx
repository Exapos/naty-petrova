'use client';
import React from 'react';

interface DailyChartProps {
  dailyData: Array<{
    date: string;
    users: number;
    sessions: number;
    pageViews: number;
  }>;
  className?: string;
}

export function DailyChart({ dailyData, className = '' }: DailyChartProps) {
  // Získáme posledních 14 dní pro přehlednost
  const recentData = dailyData.slice(-14);
  const maxValue = Math.max(...recentData.flatMap(d => [d.users, d.sessions, d.pageViews])) || 1;

  const formatDate = (dateString: string) => {
    try {
      // Formát z GA4 je YYYYMMDD, převedeme na YYYY-MM-DD
      if (dateString.length === 8) {
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        const date = new Date(`${year}-${month}-${day}T00:00:00`);
        return date.toLocaleDateString('cs-CZ', { month: 'short', day: 'numeric' });
      }
      // Pokud je již ve formátu YYYY-MM-DD
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('cs-CZ', { month: 'short', day: 'numeric' });
    } catch {
      return '---';
    }
  };

  if (!recentData || recentData.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Denní trendy
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Návštěvnost za posledních 14 dní
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
          Denní trendy
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Návštěvnost za posledních 14 dní
        </p>
      </div>

      <div className="space-y-4">
        {/* Legenda */}
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Uživatelé</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Relace</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Zobrazení</span>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <div className="flex items-end justify-between h-32 space-x-1">
            {recentData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Bars */}
                <div className="flex items-end space-x-0.5 w-full">
                  <div
                    className="bg-blue-500 rounded-t w-1/3 transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(day.users / maxValue) * 100}%` }}
                    title={`Uživatelé: ${day.users}`}
                  />
                  <div
                    className="bg-green-500 rounded-t w-1/3 transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(day.sessions / maxValue) * 100}%` }}
                    title={`Relace: ${day.sessions}`}
                  />
                  <div
                    className="bg-purple-500 rounded-t w-1/3 transition-all duration-300 hover:opacity-80"
                    style={{ height: `${(day.pageViews / maxValue) * 100}%` }}
                    title={`Zobrazení: ${day.pageViews}`}
                  />
                </div>

                {/* Date label */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 transform -rotate-45 origin-top">
                  {formatDate(day.date)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {recentData.reduce((sum, day) => sum + day.users, 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Celkem uživatelů
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {recentData.reduce((sum, day) => sum + day.sessions, 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Celkem relací
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {recentData.reduce((sum, day) => sum + day.pageViews, 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Celkem zobrazení
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}