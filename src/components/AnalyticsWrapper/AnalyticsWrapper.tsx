'use client';
import React, { useEffect, useState } from 'react';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import FacebookPixel from '@/components/FacebookPixel/FacebookPixel';
import WebVitals from '@/components/WebVitals/WebVitals';
import { usePublicSettings } from '@/hooks/usePublicSettings';

export default function AnalyticsWrapper() {
  const [isClient, setIsClient] = useState(false);
  const { settings, loading } = usePublicSettings();

  // Zajistíme, že se analytics renderují jen na klientovi
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fallback na environment variable
  const envGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gaId = settings.googleAnalytics || envGaId;

  // Během buildu nebo pokud není klient, nic nerenderujeme
  if (!isClient || (loading && !envGaId)) {
    return null;
  }

  if (!gaId) {
    return null;
  }

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <FacebookPixel pixelId={settings.facebookPixel} />
      <WebVitals measurementId={gaId} />
    </>
  );
}