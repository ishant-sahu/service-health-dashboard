/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConnectionMetrics } from '../../hooks/useConnectionMetrics';
import { metricsService } from '../../services/MetricsService';
import { metricsCacheService } from '../../services/CacheService';

// Mock the services
vi.mock('../../services/MetricsService', () => ({
  metricsService: {
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  },
}));

vi.mock('../../services/CacheService', () => ({
  metricsCacheService: {
    add: vi.fn(),
    get: vi.fn(),
  },
}));

describe('useConnectionMetrics', () => {
  const mockConnectionId = 'test-connection-1';
  const mockMetricsEvent = {
    type: 'metrics' as const,
    data: {
      rps: 500,
      latency: 150,
      errorRate: 2.5,
    },
    timestamp: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (metricsCacheService.get as any).mockReturnValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values when disabled', () => {
    const { result } = renderHook(() =>
      useConnectionMetrics({ connectionId: mockConnectionId, enabled: false })
    );

    expect(result.current.metrics).toEqual({
      rps: 0,
      latency: 0,
      errorRate: 0,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.cachedData).toEqual([]);
  });

  it('should initialize with default values when no connectionId provided', () => {
    const { result } = renderHook(() =>
      useConnectionMetrics({ enabled: true })
    );

    expect(result.current.metrics).toEqual({
      rps: 0,
      latency: 0,
      errorRate: 0,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.cachedData).toEqual([]);
  });

  it('should subscribe to metrics service when enabled with connectionId', () => {
    const mockUnsubscribe = vi.fn();
    (metricsService.subscribe as any).mockReturnValue(mockUnsubscribe);

    renderHook(() =>
      useConnectionMetrics({ connectionId: mockConnectionId, enabled: true })
    );

    expect(metricsService.subscribe).toHaveBeenCalledWith(expect.any(Function));
    expect(metricsCacheService.get).toHaveBeenCalledWith(mockConnectionId);
  });

  it('should unsubscribe from metrics service when disabled', () => {
    const mockUnsubscribe = vi.fn();
    (metricsService.subscribe as any).mockReturnValue(mockUnsubscribe);

    const { rerender } = renderHook(
      ({ enabled }) =>
        useConnectionMetrics({ connectionId: mockConnectionId, enabled }),
      { initialProps: { enabled: true } }
    );

    expect(metricsService.subscribe).toHaveBeenCalled();

    rerender({ enabled: false });

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should update metrics when receiving metrics event', () => {
    const mockUnsubscribe = vi.fn();
    let metricsHandler: any;
    (metricsService.subscribe as any).mockImplementation((handler: any) => {
      metricsHandler = handler;
      return mockUnsubscribe;
    });

    const { result } = renderHook(() =>
      useConnectionMetrics({ connectionId: mockConnectionId, enabled: true })
    );

    act(() => {
      metricsHandler(mockMetricsEvent);
    });

    // Check that metrics are clamped to the specified ranges
    expect(result.current.metrics.rps).toBeGreaterThanOrEqual(300);
    expect(result.current.metrics.rps).toBeLessThanOrEqual(1000);
    expect(result.current.metrics.latency).toBeGreaterThanOrEqual(50);
    expect(result.current.metrics.latency).toBeLessThanOrEqual(250);
    expect(result.current.metrics.errorRate).toBeGreaterThanOrEqual(0);
    expect(result.current.metrics.errorRate).toBeLessThanOrEqual(5);
  });

  it('should add metrics to cache when receiving event', () => {
    const mockUnsubscribe = vi.fn();
    let metricsHandler: any;
    (metricsService.subscribe as any).mockImplementation((handler: any) => {
      metricsHandler = handler;
      return mockUnsubscribe;
    });

    const mockCachedData = [
      {
        timestamp: Date.now() - 1000,
        time: '12:00:00',
        rps: 400,
        latency: 120,
        errorRate: 1.5,
      },
    ];
    (metricsCacheService.get as any).mockReturnValue(mockCachedData);

    renderHook(() =>
      useConnectionMetrics({ connectionId: mockConnectionId, enabled: true })
    );

    act(() => {
      metricsHandler(mockMetricsEvent);
    });

    expect(metricsCacheService.add).toHaveBeenCalledWith(
      mockConnectionId,
      expect.objectContaining({
        timestamp: expect.any(Number),
        time: expect.any(String),
        rps: expect.any(Number),
        latency: expect.any(Number),
        errorRate: expect.any(Number),
      })
    );
  });

  it('should apply connection-specific variation to metrics', () => {
    const mockUnsubscribe = vi.fn();
    let metricsHandler: any;
    (metricsService.subscribe as any).mockImplementation((handler: any) => {
      metricsHandler = handler;
      return mockUnsubscribe;
    });

    const { result } = renderHook(() =>
      useConnectionMetrics({ connectionId: 'a', enabled: true })
    );

    act(() => {
      metricsHandler(mockMetricsEvent);
    });

    const firstResult = result.current.metrics;

    // Test with different connection ID
    const { result: result2 } = renderHook(() =>
      useConnectionMetrics({ connectionId: 'z', enabled: true })
    );

    act(() => {
      metricsHandler(mockMetricsEvent);
    });

    // Results should be different due to connection-specific variation
    expect(result2.current.metrics).not.toEqual(firstResult);
  });

  it('should handle cleanup on unmount', () => {
    const mockUnsubscribe = vi.fn();
    (metricsService.subscribe as any).mockReturnValue(mockUnsubscribe);

    const { unmount } = renderHook(() =>
      useConnectionMetrics({ connectionId: mockConnectionId, enabled: true })
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should set loading state correctly', () => {
    const mockUnsubscribe = vi.fn();
    (metricsService.subscribe as any).mockReturnValue(mockUnsubscribe);

    const { result } = renderHook(() =>
      useConnectionMetrics({ connectionId: mockConnectionId, enabled: true })
    );

    expect(result.current.isLoading).toBe(true);
  });
});
