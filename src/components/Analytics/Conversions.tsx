'use client';
import React from 'react';

interface ConversionsProps {
  conversions: {
    formSubmissions: number;
    ctaClicks: number;
    phoneClicks: number;
    emailClicks: number;
  };
  className?: string;
}

export function Conversions({ conversions, className = '' }: ConversionsProps) {
  const hasData = conversions.formSubmissions > 0 || conversions.ctaClicks > 0 || 
                  conversions.phoneClicks > 0 || conversions.emailClicks > 0;

  if (!hasData) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Konverze
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Uživatelské akce a konverze
          </p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Žádná data k dispozici</p>
        </div>
      </div>
    );
  }
  const conversionItems = [
    {
      label: 'Odeslané formuláře',
      value: conversions.formSubmissions,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'CTA kliknutí',
      value: conversions.ctaClicks,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Telefonní kliky',
      value: conversions.phoneClicks,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      label: 'Email kliky',
      value: conversions.emailClicks,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Konverze
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Uživatelské akce a konverze
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {conversionItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <div className={item.color}>
                {item.icon}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}