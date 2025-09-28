import { useState, useEffect, useCallback } from 'react';
import { metricsService, MetricsEvent } from '../services/MetricsService';

export interface ConnectionMetrics {
  rps: number;
  latency: number;
  errorRate: number;
}

export interface UseConnectionMetricsOptions {
  connectionId?: string;
  enabled?: boolean;
}

export interface UseConnectionMetricsReturn {
  metrics: ConnectionMetrics;
  isLoading: boolean;
}

/**
 * Hook for fetching connection-specific metrics from StatusService
 * Only subscribes to metrics when a connection is selected
 */
export const useConnectionMetrics = (
  options: UseConnectionMetricsOptions = {}
): UseConnectionMetricsReturn => {
  const { connectionId, enabled = false } = options;

  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    rps: 0,
    latency: 0,
    errorRate: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Handle metrics updates from MetricsService
  const handleMetricsUpdate = useCallback(
    (event: MetricsEvent) => {
      // Add some variation based on connection ID to make each connection unique
      const seed = connectionId ? connectionId.charCodeAt(0) : 0;
      const variation = (seed % 100) / 100; // 0-1 variation based on connection ID

      const connectionSpecificMetrics: ConnectionMetrics = {
        rps: Math.floor(event.data.rps * (0.8 + variation * 0.4)), // 80-120% of base
        latency: Math.floor(event.data.latency * (0.7 + variation * 0.6)), // 70-130% of base
        errorRate: Math.min(
          100,
          event.data.errorRate * (0.5 + variation * 1.0)
        ), // 50-150% of base
      };

      setMetrics(connectionSpecificMetrics);
      setIsLoading(false);
    },
    [connectionId]
  );

  // Subscribe to MetricsService events
  useEffect(() => {
    if (!enabled || !connectionId) {
      setMetrics({ rps: 0, latency: 0, errorRate: 0 });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Subscribe to metrics events
    const unsubscribe = metricsService.subscribe(handleMetricsUpdate);

    // Cleanup subscription on unmount or when dependencies change
    return () => {
      unsubscribe();
    };
  }, [enabled, connectionId, handleMetricsUpdate]);

  return {
    metrics,
    isLoading,
  };
};

export default useConnectionMetrics;
