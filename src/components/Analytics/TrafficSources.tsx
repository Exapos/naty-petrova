import React from 'react';
import { AnalyticsData } from '@/lib/analytics';

interface TrafficSourcesProps {
  data: AnalyticsData['trafficSources'];
}

export function TrafficSources({ data }: TrafficSourcesProps) {
  const getSourceIcon = (source: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      google: (
        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">G</span>
        </div>
      ),
      facebook: (
        <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">f</span>
        </div>
      ),
      linkedin: (
        <div className="w-4 h-4 bg-blue-700 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">in</span>
        </div>
      ),
      direct: (
        <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">D</span>
        </div>
      ),
      referral: (
        <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">R</span>
        </div>
      ),
    };
    
    return iconMap[source.toLowerCase()] || (
      <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">?</span>
      </div>
    );
  };

  const getSourceLabel = (source: string) => {
    const labelMap: Record<string, string> = {
      google: 'Google Search',
      facebook: 'Facebook',
      linkedin: 'LinkedIn',
      direct: 'Přímý přístup',
      referral: 'Odkazy z jiných stránek',
    };
    return labelMap[source.toLowerCase()] || source;
  };

  const totalUsers = data.reduce((sum, source) => sum + source.users, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Zdroje návštěvnosti
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Odkud přicházejí vaši návštěvníci
        </p>
      </div>
      
      <div className="p-6">
        {/* Kruhový graf (simulovaný s pomocí flexboxu) */}
        <div className="mb-6">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="fill-none stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="3"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {data.map((source, index) => {
                const percentage = source.percentage;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const offset = data.slice(0, index).reduce((sum, s) => sum + s.percentage, 0);
                
                return (
                  <path
                    key={source.source}
                    className={`fill-none stroke-current ${
                      source.source === 'google' ? 'text-blue-500' :
                      source.source === 'facebook' ? 'text-blue-600' :
                      source.source === 'linkedin' ? 'text-blue-700' :
                      source.source === 'direct' ? 'text-gray-600' :
                      source.source === 'referral' ? 'text-green-600' :
                      'text-gray-400'
                    }`}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={-offset}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  celkem
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seznam zdrojů */}
        <div className="space-y-3">
          {data.map((source) => (
            <div key={source.source} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getSourceIcon(source.source)}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {getSourceLabel(source.source)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {source.users.toLocaleString()} uživatelů
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {source.percentage}%
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Žádná data o zdrojích návštěvnosti nejsou k dispozici
            </p>
          </div>
        )}
      </div>
    </div>
  );
}