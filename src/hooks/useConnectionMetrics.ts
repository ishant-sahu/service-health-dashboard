import { useState, useEffect, useCallback, useRef } from 'react';
import { metricsService, MetricsEvent } from '../services/MetricsService';
import {
  metricsCacheService,
  MetricsDataPoint,
} from '../services/CacheService';

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
  cachedData: MetricsDataPoint[];
}

// Re-export for backward compatibility
export type ChartDataPoint = MetricsDataPoint;

/**
 * Hook for fetching connection-specific metrics from MetricsService
 * Only subscribes to metrics when a connection is selected
 * Includes caching functionality to preserve historical data
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
  const [cachedData, setCachedData] = useState<MetricsDataPoint[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Handle metrics updates from MetricsService
  const handleMetricsUpdate = useCallback(
    (event: MetricsEvent) => {
      if (!connectionId) return;

      // Add some variation based on connection ID to make each connection unique
      const seed = connectionId.charCodeAt(0);
      const variation = (seed % 100) / 100; // 0-1 variation based on connection ID

      // Helper to clamp a number between a min and max
      const clamp = (value: number, min: number, max: number): number =>
        Math.min(max, Math.max(min, value));

      // Apply small variation per-connection, then CLAMP to requested ranges:
      // RPS: 300 - 1000
      // Latency: 50 - 250 ms
      // Error rate: 0.00% - 5.00%
      const variedRps = Math.floor(event.data.rps * (0.8 + variation * 0.4));
      const variedLatency = Math.floor(
        event.data.latency * (0.7 + variation * 0.6)
      );
      const variedErrorRate = Number(
        (event.data.errorRate * (0.5 + variation * 1.0)).toFixed(2)
      );

      const connectionSpecificMetrics: ConnectionMetrics = {
        rps: clamp(variedRps, 300, 1000),
        latency: clamp(variedLatency, 50, 250),
        errorRate: clamp(variedErrorRate, 0, 5),
      };

      setMetrics(connectionSpecificMetrics);

      // Create new data point for caching
      const now = Date.now();
      const timeString = new Date(now).toLocaleTimeString();
      const newDataPoint: MetricsDataPoint = {
        timestamp: now,
        time: timeString,
        rps: connectionSpecificMetrics.rps,
        latency: connectionSpecificMetrics.latency,
        errorRate: connectionSpecificMetrics.errorRate,
      };

      // Update cache for this connection
      metricsCacheService.add(connectionId, newDataPoint);

      // Update local state with cached data
      const updatedCache = metricsCacheService.get(connectionId);
      setCachedData(updatedCache);
      setIsLoading(false);
    },
    [connectionId]
  );

  // Subscribe to MetricsService events and handle caching
  useEffect(() => {
    if (!enabled || !connectionId) {
      setMetrics({ rps: 0, latency: 0, errorRate: 0 });
      setCachedData([]);
      setIsLoading(false);

      // Cleanup subscription if exists
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      return;
    }

    setIsLoading(true);

    // Load cached data for this connection
    const cachedDataForConnection = metricsCacheService.get(connectionId);
    setCachedData(cachedDataForConnection);

    // Subscribe to metrics events
    const unsubscribe = metricsService.subscribe(handleMetricsUpdate);
    unsubscribeRef.current = unsubscribe;

    // Cleanup subscription on unmount or when dependencies change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [enabled, connectionId, handleMetricsUpdate]);

  return {
    metrics,
    isLoading,
    cachedData,
  };
};

export default useConnectionMetrics;
