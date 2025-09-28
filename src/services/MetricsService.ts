import { generateMetrics } from '../data/mock';

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

class MetricsService {
  private config: MetricsConfig;
  private subscribers: Set<MetricsEventHandler> = new Set();
  private interval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(config: Partial<MetricsConfig> = {}) {
    this.config = {
      interval: 2500, // Default 2.5 seconds
      ...config,
    };
  }

  /**
   * Start the metrics stream
   */
  start(): void {
    if (this.isRunning) {
      console.warn('MetricsService is already running');
      return;
    }

    this.isRunning = true;
    this.startMetricsGeneration();
  }

  /**
   * Stop the metrics stream
   */
  stop(): void {
    if (!this.isRunning) {
      console.warn('MetricsService is not running');
      return;
    }

    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Subscribe to metrics events
   */
  subscribe(handler: MetricsEventHandler): () => void {
    const wasEmpty = this.subscribers.size === 0;
    this.subscribers.add(handler);

    // Start the service if this is the first subscriber
    if (wasEmpty && !this.isRunning) {
      this.start();
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(handler);

      // Stop the service if no more subscribers
      if (this.subscribers.size === 0 && this.isRunning) {
        this.stop();
      }
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<MetricsConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Restart if running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): MetricsConfig {
    return { ...this.config };
  }

  /**
   * Check if the service is running
   */
  isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Get current subscriber count
   */
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  private startMetricsGeneration(): void {
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

  private emit(event: MetricsEvent): void {
    this.subscribers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in metrics event handler:', error);
      }
    });
  }
}

// Create singleton instance
export const metricsService = new MetricsService();

export default MetricsService;
