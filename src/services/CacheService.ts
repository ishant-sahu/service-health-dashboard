/**
 * Generic cache service for storing and retrieving data by key
 * Supports different data types and provides memory management
 */
export class CacheService<T> {
  private cache: Map<string, T[]>;
  private maxSize: number;

  constructor(maxSize: number = 20) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Add a new item to the cache for a specific key
   */
  add(key: string, item: T): void {
    const currentData = this.cache.get(key) || [];
    const updatedData = [...currentData, item].slice(-this.maxSize);
    this.cache.set(key, updatedData);
  }

  /**
   * Get cached data for a specific key
   */
  get(key: string): T[] {
    return this.cache.get(key) || [];
  }

  /**
   * Set cached data for a specific key (replaces existing data)
   */
  set(key: string, data: T[]): void {
    const trimmedData = data.slice(-this.maxSize);
    this.cache.set(key, trimmedData);
  }

  /**
   * Check if data exists for a specific key
   */
  has(key: string): boolean {
    return this.cache.has(key) && this.cache.get(key)!.length > 0;
  }

  /**
   * Get the number of items cached for a specific key
   */
  size(key: string): number {
    return this.cache.get(key)?.length || 0;
  }

  /**
   * Clear data for a specific key
   */
  clear(key?: string): void {
    if (typeof key === 'string') {
      this.cache.delete(key);
    } else {
      this.clearAll();
    }
  }

  /**
   * Clear all cached data
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Get all cached keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get total number of cached items across all keys
   */
  totalSize(): number {
    let total = 0;
    this.cache.forEach((data) => {
      total += data.length;
    });
    return total;
  }

  /**
   * Update the maximum size for cached items
   */
  setMaxSize(newMaxSize: number): void {
    this.maxSize = newMaxSize;

    // Trim existing data to new max size
    this.cache.forEach((data, key) => {
      if (data.length > newMaxSize) {
        this.cache.set(key, data.slice(-newMaxSize));
      }
    });
  }

  /**
   * Get the current maximum size
   */
  getMaxSize(): number {
    return this.maxSize;
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalKeys: number;
    totalItems: number;
    maxSize: number;
    averageItemsPerKey: number;
  } {
    const totalKeys = this.cache.size;
    const totalItems = this.totalSize();
    const averageItemsPerKey = totalKeys > 0 ? totalItems / totalKeys : 0;

    return {
      totalKeys,
      totalItems,
      maxSize: this.maxSize,
      averageItemsPerKey: Math.round(averageItemsPerKey * 100) / 100,
    };
  }
}

// Define specific types for different cache services
export interface MetricsDataPoint {
  timestamp: number;
  time: string;
  rps: number;
  latency: number;
  errorRate: number;
}

// Create singleton instances for different data types
export const metricsCacheService = new CacheService<MetricsDataPoint>(20);

// Export the class for creating custom cache instances
export default CacheService;
