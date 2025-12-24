'use client';
import { useState, useEffect, useCallback } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  sampleSize?: number;
}

export function useWebVitals(days: number = 30) {
  const [data, setData] = useState<WebVitalsMetric[]>([]);
  const [totalSamples, setTotalSamples] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  const fetchWebVitals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Zkusíme nejdříve naše vlastní API
      const response = await fetch(`/api/web-vitals?days=${days}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data.metrics || []);
        setTotalSamples(result.data.totalSamples || 0);
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
    totalSamples,
    loading,
    error,
    isRealData,
    refetch
  };
}
