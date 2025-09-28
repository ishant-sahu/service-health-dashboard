import { SERVICE_STATUS } from '../constants/dashboard';
import { generateMetrics, getRandomStatus } from '../data/mock';

export interface ServiceMetrics {
  rps: number;
  latency: number;
  errorRate: number;
}

export interface ServiceStatusUpdate {
  serviceId: string;
  status: (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];
  timestamp: number;
}

export interface ConnectionStatusUpdate {
  connectionId: string;
  status: (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];
  timestamp: number;
}

export interface StreamConfig {
  metricsInterval: number;
  statusUpdateInterval: number;
  statusChangeProbability: number;
  connectionChangeProbability: number;
}

export type StreamEventType = 'metrics' | 'serviceStatus' | 'connectionStatus';

export interface StreamEvent {
  type: StreamEventType;
  data: ServiceMetrics | ServiceStatusUpdate | ConnectionStatusUpdate;
  timestamp: number;
}

export type StreamEventHandler = (event: StreamEvent) => void;

class DataStreamManager {
  private config: StreamConfig;
  private subscribers: Map<StreamEventType, Set<StreamEventHandler>> =
    new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;
  private serviceIds: string[] = [];
  private connectionIds: string[] = [];

  constructor(config: Partial<StreamConfig> = {}) {
    this.config = {
      metricsInterval: 2500,
      statusUpdateInterval: 5000,
      statusChangeProbability: 0.1,
      connectionChangeProbability: 0.05,
      ...config,
    };

    // Initialize event type sets
    this.subscribers.set('metrics', new Set());
    this.subscribers.set('serviceStatus', new Set());
    this.subscribers.set('connectionStatus', new Set());
  }

  /**
   * Start the data stream
   */
  start(): void {
    if (this.isRunning) {
      console.warn('DataStreamManager is already running');
      return;
    }

    this.isRunning = true;
    this.startMetricsStream();
    this.startStatusUpdateStream();
  }

  /**
   * Stop the data stream
   */
  stop(): void {
    if (!this.isRunning) {
      console.warn('DataStreamManager is not running');
      return;
    }

    this.isRunning = false;
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }

  /**
   * Subscribe to stream events
   */
  subscribe(
    eventType: StreamEventType,
    handler: StreamEventHandler
  ): () => void {
    const subscribers = this.subscribers.get(eventType);
    if (!subscribers) {
      throw new Error(`Unknown event type: ${eventType}`);
    }

    subscribers.add(handler);

    // Return unsubscribe function
    return () => {
      subscribers.delete(handler);
    };
  }

  /**
   * Update service IDs to monitor
   */
  setServiceIds(serviceIds: string[]): void {
    this.serviceIds = [...serviceIds];
  }

  /**
   * Update connection IDs to monitor
   */
  setConnectionIds(connectionIds: string[]): void {
    this.connectionIds = [...connectionIds];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<StreamConfig>): void {
    this.config = { ...this.config, ...newConfig };

    // Restart streams if running
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): StreamConfig {
    return { ...this.config };
  }

  /**
   * Check if the stream is running
   */
  isActive(): boolean {
    return this.isRunning;
  }

  private startMetricsStream(): void {
    const interval = setInterval(() => {
      const metrics = generateMetrics();
      const event: StreamEvent = {
        type: 'metrics',
        data: metrics,
        timestamp: Date.now(),
      };
      this.emit('metrics', event);
    }, this.config.metricsInterval);

    this.intervals.set('metrics', interval);
  }

  private startStatusUpdateStream(): void {
    const interval = setInterval(() => {
      // Generate service status updates
      this.serviceIds.forEach((serviceId) => {
        if (Math.random() < this.config.statusChangeProbability) {
          const statusUpdate: ServiceStatusUpdate = {
            serviceId,
            status: getRandomStatus(),
            timestamp: Date.now(),
          };
          const event: StreamEvent = {
            type: 'serviceStatus',
            data: statusUpdate,
            timestamp: Date.now(),
          };
          this.emit('serviceStatus', event);
        }
      });

      // Generate connection status updates
      this.connectionIds.forEach((connectionId) => {
        if (Math.random() < this.config.connectionChangeProbability) {
          const statusUpdate: ConnectionStatusUpdate = {
            connectionId,
            status: getRandomStatus(),
            timestamp: Date.now(),
          };
          const event: StreamEvent = {
            type: 'connectionStatus',
            data: statusUpdate,
            timestamp: Date.now(),
          };
          this.emit('connectionStatus', event);
        }
      });
    }, this.config.statusUpdateInterval);

    this.intervals.set('statusUpdate', interval);
  }

  private emit(eventType: StreamEventType, event: StreamEvent): void {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(
            `Error in stream event handler for ${eventType}:`,
            error
          );
        }
      });
    }
  }
}

// Create singleton instance
export const dataStreamManager = new DataStreamManager();

export default DataStreamManager;
