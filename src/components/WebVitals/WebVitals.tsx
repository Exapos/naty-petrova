'use client';
import { useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface WebVitalsProps {
  measurementId?: string;
}

export default function WebVitals({ measurementId }: WebVitalsProps) {
  const { consent, loading } = useCookieConsent();

  useEffect(() => {
    // Only load Web Vitals if user consented to analytics
    if (loading || !consent || !measurementId) {
      return;
    }

    const reportWebVitals = (metric: any) => {
      // Send to Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.value),
          custom_map: {
            metric_value: metric.value,
            metric_rating: metric.rating
          }
        });
      }

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vitals:', {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          id: metric.id
        });
      }
    };

    // Dynamically import web-vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportWebVitals);
      getFID(reportWebVitals);
      getFCP(reportWebVitals);
      getLCP(reportWebVitals);
      getTTFB(reportWebVitals);
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, [consent, loading, measurementId]);

  // Don't render anything - this is just for tracking
  return null;
}
