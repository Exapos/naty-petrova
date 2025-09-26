'use client';
import { useEffect } from 'react';
import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId?: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  useEffect(() => {
    if (gaId && typeof window !== 'undefined') {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      
      // Define gtag function
      window.gtag = function gtag(...args: any[]) {
        window.dataLayer.push(args);
      };
      
      // Configure Google Analytics
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [gaId]);

  // Don't render anything if no GA ID
  if (!gaId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
    </>
  );
}