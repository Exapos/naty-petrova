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
    if (loading || !consent) {
      return;
    }

    const reportWebVitals = async (metric: any) => {
      // Send to our own API for storage
      try {
        await fetch('/api/web-vitals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
            page: typeof window !== 'undefined' ? window.location.pathname : null,
          }),
        });
      } catch (error) {
        // Silently fail - web vitals collection shouldn't break the page
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to report Web Vitals to API:', error);
        }
      }

      // Also send to Google Analytics if configured
      if (measurementId && typeof window !== 'undefined' && window.gtag) {
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
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      // Use the new onXXX functions (v3+)
      onCLS(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
      onINP(reportWebVitals);
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
    });
  }, [consent, loading, measurementId]);

  // Don't render anything - this is just for tracking
  return null;
}
