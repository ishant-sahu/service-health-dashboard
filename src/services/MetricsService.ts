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
      const metrics = generateMetrics();
      const event: MetricsEvent = {
        type: 'metrics',
        data: metrics,
        timestamp: Date.now(),
      };
      this.emit(event);
    }, this.config.interval);
  }
}

// Create singleton instance
export const metricsService = new MetricsService();

export default MetricsService;
