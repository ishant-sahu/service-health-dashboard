import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import MetricsService from '../../services/MetricsService';
import { generateMetrics } from '../../data/mock';

// Mock the generateMetrics function
vi.mock('../../data/mock', () => ({
  generateMetrics: vi.fn(() => ({
    rps: 500,
    latency: 150,
    errorRate: 2.5,
  })),
}));

describe('MetricsService', () => {
  let metricsService: MetricsService | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockGenerateMetrics: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockGenerateMetrics = vi.mocked(generateMetrics as any);
    // Ensure a known-good implementation for each test
    mockGenerateMetrics.mockReset();
    mockGenerateMetrics.mockImplementation(() => ({
      rps: 500,
      latency: 150,
      errorRate: 2.5,
    }));

    metricsService = new MetricsService({ interval: 1000 });
  });

  afterEach(() => {
    vi.useRealTimers();
    if (metricsService) metricsService.stop();
  });

  it('should create instance with default config', () => {
    const service = new MetricsService();
    expect(service).toBeInstanceOf(MetricsService);
  });

  it('should create instance with custom config', () => {
    const customConfig = { interval: 2000 };
    const service = new MetricsService(customConfig);
    expect(service).toBeInstanceOf(MetricsService);
  });

  it('should start streaming metrics', () => {
    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);
    metricsService.start();

    // Fast-forward time to trigger interval
    vi.advanceTimersByTime(1000);

    expect(mockGenerateMetrics).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledWith({
      type: 'metrics',
      data: {
        rps: 500,
        latency: 150,
        errorRate: 2.5,
      },
      timestamp: expect.any(Number),
    });
  });

  it('should emit metrics events at specified interval', () => {
    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);
    metricsService.start();

    // Fast-forward time to trigger multiple intervals
    vi.advanceTimersByTime(3000);

    expect(mockHandler).toHaveBeenCalledTimes(3);
    expect(mockGenerateMetrics).toHaveBeenCalledTimes(3);
  });

  it('should not start if already running', () => {
    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);

    metricsService.start();
    metricsService.start(); // Second call should be ignored

    vi.advanceTimersByTime(1000);

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should stop streaming metrics', () => {
    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);
    metricsService.start();

    metricsService.stop();

    vi.advanceTimersByTime(2000);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should handle multiple subscribers', () => {
    const mockHandler1 = vi.fn();
    const mockHandler2 = vi.fn();

    metricsService.subscribe(mockHandler1);
    metricsService.subscribe(mockHandler2);
    metricsService.start();

    vi.advanceTimersByTime(1000);

    expect(mockHandler1).toHaveBeenCalledTimes(1);
    expect(mockHandler2).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe handlers', () => {
    const mockHandler1 = vi.fn();
    const mockHandler2 = vi.fn();

    const unsubscribe1 = metricsService.subscribe(mockHandler1);
    metricsService.subscribe(mockHandler2);
    metricsService.start();

    unsubscribe1();

    vi.advanceTimersByTime(1000);

    expect(mockHandler1).not.toHaveBeenCalled();
    expect(mockHandler2).toHaveBeenCalledTimes(1);
  });

  it('should generate unique timestamps for each event', () => {
    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);
    metricsService.start();

    vi.advanceTimersByTime(2000);

    expect(mockHandler).toHaveBeenCalledTimes(2);

    const firstCall = mockHandler.mock.calls[0][0];
    const secondCall = mockHandler.mock.calls[1][0];

    expect(firstCall.timestamp).toBeLessThan(secondCall.timestamp);
  });

  it('should handle rapid start/stop cycles', () => {
    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);

    metricsService.start();
    metricsService.stop();
    metricsService.start();
    metricsService.stop();

    vi.advanceTimersByTime(2000);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should use correct event structure', () => {
    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);
    metricsService.start();

    vi.advanceTimersByTime(1000);

    const event = mockHandler.mock.calls[0][0];

    expect(event).toHaveProperty('type', 'metrics');
    expect(event).toHaveProperty('data');
    expect(event).toHaveProperty('timestamp');
    expect(event.data).toHaveProperty('rps');
    expect(event.data).toHaveProperty('latency');
    expect(event.data).toHaveProperty('errorRate');
  });

  it('should handle errors gracefully', () => {
    // Mock generateMetrics to throw an error
    mockGenerateMetrics.mockImplementation(() => {
      throw new Error('Mock error');
    });

    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);

    // Should not throw
    expect(() => {
      metricsService.start();
      vi.advanceTimersByTime(1000);
    }).not.toThrow();
  });

  it('should maintain interval accuracy', () => {
    const mockHandler = vi.fn();
    metricsService.subscribe(mockHandler);
    metricsService.start();

    vi.advanceTimersByTime(1000);
    const firstCallTime = Date.now();

    vi.advanceTimersByTime(1000);
    const secondCallTime = Date.now();

    expect(mockHandler).toHaveBeenCalledTimes(2);
    expect(secondCallTime - firstCallTime).toBe(1000);
  });
});
