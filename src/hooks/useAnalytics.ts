import { useState, useEffect, useCallback } from 'react';
import { AnalyticsData } from '@/lib/analytics';

interface UseAnalyticsResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  isRealData: boolean;
  refetch: () => void;
}

export function useAnalytics(days: number = 30): UseAnalyticsResult {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics?days=${days}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setIsRealData(result.isRealData);
      } else {
        throw new Error(result.error || 'Failed to fetch analytics data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    isRealData,
    refetch: fetchAnalytics,
  };
}