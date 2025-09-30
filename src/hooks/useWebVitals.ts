'use client';
import { useState, useEffect, useCallback } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
}

export function useWebVitals(days: number = 30) {
  const [data, setData] = useState<WebVitalsMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  const fetchWebVitals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/web-vitals?days=${days}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data.metrics || []);
        setIsRealData(result.isRealData || false);
      } else {
        throw new Error(result.error || 'Failed to fetch WebVitals data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch WebVitals data');
      console.error('WebVitals fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchWebVitals();
  }, [fetchWebVitals]);

  const refetch = () => {
    fetchWebVitals();
  };

  return {
    data,
    loading,
    error,
    isRealData,
    refetch
  };
}
