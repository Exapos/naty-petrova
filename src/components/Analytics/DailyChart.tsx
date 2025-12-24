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

  // Výpočet výšky sloupce v pixelech (max 128px = 8rem)
  const getBarHeight = (value: number) => {
    if (value === 0) return 4; // Minimální výška pro viditelnost
    return Math.max(4, Math.round((value / maxValue) * 128));
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

        {/* Chart - s fixní výškou a správným zarovnáním */}
        <div className="relative pt-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-4 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-8">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue / 2)}</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-10">
            <div className="flex items-end justify-between gap-1" style={{ height: '128px' }}>
              {recentData.map((day, index) => (
                <div key={index} className="flex-1 flex items-end justify-center gap-0.5 h-full">
                  {/* Jednotlivé sloupce */}
                  <div
                    className="bg-blue-500 rounded-t flex-1 max-w-3 transition-all duration-300 hover:bg-blue-400 cursor-pointer"
                    style={{ height: `${getBarHeight(day.users)}px` }}
                    title={`Uživatelé: ${day.users}`}
                  />
                  <div
                    className="bg-green-500 rounded-t flex-1 max-w-3 transition-all duration-300 hover:bg-green-400 cursor-pointer"
                    style={{ height: `${getBarHeight(day.sessions)}px` }}
                    title={`Relace: ${day.sessions}`}
                  />
                  <div
                    className="bg-purple-500 rounded-t flex-1 max-w-3 transition-all duration-300 hover:bg-purple-400 cursor-pointer"
                    style={{ height: `${getBarHeight(day.pageViews)}px` }}
                    title={`Zobrazení: ${day.pageViews}`}
                  />
                </div>
              ))}
            </div>

            {/* Date labels */}
            <div className="flex justify-between mt-2 overflow-hidden">
              {recentData.map((day, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatDate(day.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {recentData.reduce((sum, day) => sum + day.users, 0).toLocaleString('cs-CZ')}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Celkem uživatelů
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              {recentData.reduce((sum, day) => sum + day.sessions, 0).toLocaleString('cs-CZ')}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Celkem relací
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {recentData.reduce((sum, day) => sum + day.pageViews, 0).toLocaleString('cs-CZ')}
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