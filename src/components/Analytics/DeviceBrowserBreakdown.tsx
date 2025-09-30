'use client';
import React from 'react';

interface DeviceBrowserBreakdownProps {
  devices: Array<{
    device: string;
    users: number;
    percentage: number;
  }>;
  browsers: Array<{
    browser: string;
    users: number;
    percentage: number;
  }>;
  className?: string;
}

export function DeviceBrowserBreakdown({ devices, browsers, className = '' }: DeviceBrowserBreakdownProps) {
  const hasDeviceData = devices && devices.length > 0;
  const hasBrowserData = browsers && browsers.length > 0;

  if (!hasDeviceData && !hasBrowserData) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Zařízení a prohlížeče
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Rozložení návštěvníků
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Žádná data k dispozici</p>
        </div>
      </div>
    );
  }
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'mobile':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'tablet':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getBrowserIcon = (browser: string) => {
    const iconClass = "w-5 h-5";
    switch (browser.toLowerCase()) {
      case 'chrome':
        return <div className={`${iconClass} bg-blue-500 rounded-full`} />;
      case 'firefox':
        return <div className={`${iconClass} bg-orange-500 rounded-full`} />;
      case 'safari':
        return <div className={`${iconClass} bg-blue-400 rounded-full`} />;
      case 'edge':
        return <div className={`${iconClass} bg-green-500 rounded-full`} />;
      default:
        return <div className={`${iconClass} bg-gray-400 rounded-full`} />;
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Zařízení a prohlížeče
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Rozložení návštěvníků
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Devices */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Zařízení</h4>
          <div className="space-y-3">
            {devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-600 dark:text-gray-400">
                    {getDeviceIcon(device.device)}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.device}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {device.users}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Browsers */}
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Prohlížeče</h4>
          <div className="space-y-3">
            {browsers.map((browser, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getBrowserIcon(browser.browser)}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {browser.browser}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {browser.users}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {browser.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}