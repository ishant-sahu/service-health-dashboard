import { describe, it, expect, beforeEach } from 'vitest';
import CacheService, { MetricsDataPoint } from '../../services/CacheService';

describe('CacheService', () => {
  let metricsCacheService: CacheService<MetricsDataPoint>;
  const mockDataPoint: MetricsDataPoint = {
    timestamp: Date.now(),
    time: '12:00:00',
    rps: 500,
    latency: 150,
    errorRate: 2.5,
  };

  const mockDataPoint2: MetricsDataPoint = {
    timestamp: Date.now() + 1000,
    time: '12:00:01',
    rps: 520,
    latency: 145,
    errorRate: 2.3,
  };

  beforeEach(() => {
    metricsCacheService = new CacheService<MetricsDataPoint>(20);
  });

  it('should add data point to cache', () => {
    const connectionId = 'test-connection-1';

    metricsCacheService.add(connectionId, mockDataPoint);

    const cachedData = metricsCacheService.get(connectionId);
    expect(cachedData).toHaveLength(1);
    expect(cachedData[0]).toEqual(mockDataPoint);
  });

  it('should add multiple data points to cache', () => {
    const connectionId = 'test-connection-1';

    metricsCacheService.add(connectionId, mockDataPoint);
    metricsCacheService.add(connectionId, mockDataPoint2);

    const cachedData = metricsCacheService.get(connectionId);
    expect(cachedData).toHaveLength(2);
    expect(cachedData[0]).toEqual(mockDataPoint);
    expect(cachedData[1]).toEqual(mockDataPoint2);
  });

  it('should maintain separate caches for different connections', () => {
    const connectionId1 = 'test-connection-1';
    const connectionId2 = 'test-connection-2';

    metricsCacheService.add(connectionId1, mockDataPoint);
    metricsCacheService.add(connectionId2, mockDataPoint2);

    const cachedData1 = metricsCacheService.get(connectionId1);
    const cachedData2 = metricsCacheService.get(connectionId2);

    expect(cachedData1).toHaveLength(1);
    expect(cachedData2).toHaveLength(1);
    expect(cachedData1[0]).toEqual(mockDataPoint);
    expect(cachedData2[0]).toEqual(mockDataPoint2);
  });

  it('should return empty array for non-existent connection', () => {
    const connectionId = 'non-existent-connection';

    const cachedData = metricsCacheService.get(connectionId);
    expect(cachedData).toEqual([]);
  });

  it('should limit cache size to maximum items', () => {
    const connectionId = 'test-connection-1';
    const maxItems = 10;
    metricsCacheService = new CacheService<MetricsDataPoint>(maxItems);

    // Add more items than the limit
    for (let i = 0; i < maxItems + 5; i++) {
      const dataPoint: MetricsDataPoint = {
        timestamp: Date.now() + i * 1000,
        time: `12:00:${i.toString().padStart(2, '0')}`,
        rps: 500 + i,
        latency: 150 - i,
        errorRate: 2.5 - i * 0.1,
      };
      metricsCacheService.add(connectionId, dataPoint);
    }

    const cachedData = metricsCacheService.get(connectionId);
    expect(cachedData.length).toBeLessThanOrEqual(maxItems);
  });

  it('should maintain chronological order of data points', () => {
    const connectionId = 'test-connection-1';

    // Add data points in chronological order
    const base = Date.now();
    const dataPoint1: MetricsDataPoint = {
      timestamp: base + 1000,
      time: '12:00:01',
      rps: 510,
      latency: 148,
      errorRate: 2.4,
    };

    const dataPoint2: MetricsDataPoint = {
      timestamp: base + 2000,
      time: '12:00:02',
      rps: 520,
      latency: 145,
      errorRate: 2.3,
    };

    metricsCacheService.add(connectionId, dataPoint1);
    metricsCacheService.add(connectionId, dataPoint2);

    const cachedData = metricsCacheService.get(connectionId);
    expect(cachedData).toHaveLength(2);
    expect(cachedData[0].timestamp).toBeLessThan(cachedData[1].timestamp);
  });

  it('should clear cache for specific connection', () => {
    const connectionId = 'test-connection-1';

    metricsCacheService.add(connectionId, mockDataPoint);
    metricsCacheService.add(connectionId, mockDataPoint2);

    expect(metricsCacheService.get(connectionId)).toHaveLength(2);

    metricsCacheService.clear(connectionId);

    expect(metricsCacheService.get(connectionId)).toEqual([]);
  });

  it('should clear all caches when no connection specified', () => {
    const connectionId1 = 'test-connection-1';
    const connectionId2 = 'test-connection-2';

    metricsCacheService.add(connectionId1, mockDataPoint);
    metricsCacheService.add(connectionId2, mockDataPoint2);

    expect(metricsCacheService.get(connectionId1)).toHaveLength(1);
    expect(metricsCacheService.get(connectionId2)).toHaveLength(1);

    metricsCacheService.clear();

    expect(metricsCacheService.get(connectionId1)).toEqual([]);
    expect(metricsCacheService.get(connectionId2)).toEqual([]);
  });

  it('should handle duplicate timestamps correctly', () => {
    const connectionId = 'test-connection-1';
    const sameTimestamp = Date.now();

    const dataPoint1: MetricsDataPoint = {
      timestamp: sameTimestamp,
      time: '12:00:00',
      rps: 500,
      latency: 150,
      errorRate: 2.5,
    };

    const dataPoint2: MetricsDataPoint = {
      timestamp: sameTimestamp,
      time: '12:00:00',
      rps: 510,
      latency: 145,
      errorRate: 2.3,
    };

    metricsCacheService.add(connectionId, dataPoint1);
    metricsCacheService.add(connectionId, dataPoint2);

    const cachedData = metricsCacheService.get(connectionId);
    expect(cachedData).toHaveLength(2);
  });

  it('should handle empty data points', () => {
    const connectionId = 'test-connection-1';
    const emptyDataPoint: MetricsDataPoint = {
      timestamp: Date.now(),
      time: '12:00:00',
      rps: 0,
      latency: 0,
      errorRate: 0,
    };

    metricsCacheService.add(connectionId, emptyDataPoint);

    const cachedData = metricsCacheService.get(connectionId);
    expect(cachedData).toHaveLength(1);
    expect(cachedData[0]).toEqual(emptyDataPoint);
  });

  it('should handle negative values in data points', () => {
    const connectionId = 'test-connection-1';
    const negativeDataPoint: MetricsDataPoint = {
      timestamp: Date.now(),
      time: '12:00:00',
      rps: -100,
      latency: -50,
      errorRate: -1.0,
    };

    metricsCacheService.add(connectionId, negativeDataPoint);

    const cachedData = metricsCacheService.get(connectionId);
    expect(cachedData).toHaveLength(1);
    expect(cachedData[0]).toEqual(negativeDataPoint);
  });

  it('should maintain cache across multiple operations', () => {
    const connectionId = 'test-connection-1';

    // Add initial data
    metricsCacheService.add(connectionId, mockDataPoint);
    expect(metricsCacheService.get(connectionId)).toHaveLength(1);

    // Add more data
    metricsCacheService.add(connectionId, mockDataPoint2);
    expect(metricsCacheService.get(connectionId)).toHaveLength(2);

    // Get data multiple times
    const data1 = metricsCacheService.get(connectionId);
    const data2 = metricsCacheService.get(connectionId);

    expect(data1).toEqual(data2);
    expect(data1).toHaveLength(2);
  });

  it('should handle concurrent access safely', () => {
    const connectionId = 'test-connection-1';

    // Simulate concurrent additions
    const promises = Array.from({ length: 10 }, (_, i) => {
      const dataPoint: MetricsDataPoint = {
        timestamp: Date.now() + i * 100,
        time: `12:00:${i.toString().padStart(2, '0')}`,
        rps: 500 + i,
        latency: 150 - i,
        errorRate: 2.5 - i * 0.1,
      };
      return Promise.resolve(metricsCacheService.add(connectionId, dataPoint));
    });

    Promise.all(promises).then(() => {
      const cachedData = metricsCacheService.get(connectionId);
      expect(cachedData).toHaveLength(10);
    });
  });
});
