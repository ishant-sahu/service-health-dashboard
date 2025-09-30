import { generateMetrics } from '../data/mock';
import { StreamService } from './StreamService';

export interface ServiceMetrics {
  rps: number;
  latency: number;
  errorRate: number;
}

export interface MetricsEvent {
  type: 'metrics';
  data: ServiceMetrics;
  timestamp: number;
}

export type MetricsEventHandler = (event: MetricsEvent) => void;

export interface MetricsConfig {
  interval: number;
}

class MetricsService extends StreamService<MetricsEvent, MetricsConfig> {
  constructor(config: Partial<MetricsConfig> = {}) {
    super({
      interval: 2500, // Default 2.5 seconds
      ...config,
    });
  }

  protected startStream(): void {
    // Don't start if already running
    if (this.interval) {
      return;
    }

    this.interval = setInterval(() => {
      try {
        const metrics = generateMetrics();
        const event: MetricsEvent = {
          type: 'metrics',
          data: metrics,
          timestamp: Date.now(),
        };
        this.emit(event);
      } catch {
        // Swallow generator errors to keep stream stable during tests
      }
    }, this.config.interval);
  }
}

// Create singleton instance
export const metricsService = new MetricsService();

export default MetricsService;
