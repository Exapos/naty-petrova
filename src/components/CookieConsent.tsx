"use client";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

import React, { useEffect, useState } from 'react';

const COOKIE_KEY = 'cookie_consent_analytics';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [consent, setConsent] = useState<null | boolean>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (stored === 'true') setConsent(true);
    else if (stored === 'false') setConsent(false);
    else setVisible(true);
  }, []);


  // Dynamicky načti gtag.js a inicializuj až po souhlasu
  const loadGtag = () => {
    if (!GA_MEASUREMENT_ID) return;
    if (document.getElementById('ga-gtag')) return;
    const script = document.createElement('script');
    script.id = 'ga-gtag';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]){window.dataLayer.push(args);};
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  };

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'true');
    setConsent(true);
    setVisible(false);
    loadGtag();
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_KEY, 'false');
    setConsent(false);
    setVisible(false);
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', { analytics_storage: 'denied' });
    }
  };

  // Pokud uživatel už rozhodl, nic nezobrazuj
  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white border border-gray-300 shadow-lg rounded-xl px-6 py-4 flex flex-col md:flex-row items-center gap-4 max-w-xl w-full mx-4">
        <span className="text-gray-800 text-sm">
          Tento web používá cookies pro analytické účely. Pro pokračování je potřeba Váš souhlas.
        </span>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleAccept}
          >
            Povolit
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            onClick={handleDecline}
          >
            Zakázat
          </button>
        </div>
      </div>
    </div>
  );
}
