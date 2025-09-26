'use client';
import React from 'react';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import { usePublicSettings } from '@/hooks/usePublicSettings';

export default function AnalyticsWrapper() {
  const { settings, loading } = usePublicSettings();
  
  // Fallback na environment variable
  const envGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gaId = settings.googleAnalytics || envGaId;

  if (loading && !envGaId) {
    return null;
  }

  if (!gaId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}