import React from 'react';
import { AnalyticsData } from '@/lib/analytics';

interface TopPagesProps {
  data: AnalyticsData['topPages'];
}

export function TopPages({ data }: TopPagesProps) {
  const getPageTitle = (path: string) => {
    const pageMap: Record<string, string> = {
      '/': 'Domovská stránka',
      '/o-nas': 'O nás',
      '/sluzby': 'Služby',
      '/projekty': 'Projekty',
      '/reference': 'Reference',
      '/kontakt': 'Kontakt',
      '/kariera': 'Kariéra',
    };
    return pageMap[path] || path;
  };

  const maxViews = Math.max(...data.map(page => page.views));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Nejnavštěvovanější stránky
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Stránky s nejvyšším počtem zobrazení
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {data.map((page, index) => {
            const widthPercentage = (page.views / maxViews) * 100;
            
            return (
              <div key={page.page} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getPageTitle(page.page)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {page.page}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {page.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {page.uniqueViews.toLocaleString()} unikátních
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Žádná data o stránkách nejsou k dispozici
            </p>
          </div>
        )}
      </div>
    </div>
  );
}