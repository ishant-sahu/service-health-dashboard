import { SERVICE_STATUS } from '../constants/dashboard';
import { getRandomStatus } from '../data/mock';
import { MultiEventStreamService } from './StreamService';

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
  statusUpdateInterval: number;
  statusChangeProbability: number;
  connectionChangeProbability: number;
}

export type StreamEventType = 'serviceStatus' | 'connectionStatus';

export interface StreamEvent {
  type: StreamEventType;
  data: ServiceStatusUpdate | ConnectionStatusUpdate;
  timestamp: number;
}

export type StreamEventHandler = (event: StreamEvent) => void;

class StatusService extends MultiEventStreamService<
  StreamEvent,
  StreamEventType,
  StreamConfig
> {
  private serviceIds: string[] = [];
  private connectionIds: string[] = [];

  constructor(config: Partial<StreamConfig> = {}) {
    super({
      statusUpdateInterval: 5000,
      statusChangeProbability: 0.1,
      connectionChangeProbability: 0.05,
      ...config,
    });

    // Initialize event type sets
    this.subscribers.set('serviceStatus', new Set());
    this.subscribers.set('connectionStatus', new Set());
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

  protected startStreams(): void {
    // Only start status stream if there are subscribers
    const serviceStatusSubscribers = this.subscribers.get('serviceStatus');
    const connectionStatusSubscribers =
      this.subscribers.get('connectionStatus');
    if (
      (serviceStatusSubscribers && serviceStatusSubscribers.size > 0) ||
      (connectionStatusSubscribers && connectionStatusSubscribers.size > 0)
    ) {
      this.startStreamForEventType('serviceStatus');
    }
  }

  protected startStreamForEventType(eventType: StreamEventType): void {
    if (eventType === 'serviceStatus' || eventType === 'connectionStatus') {
      this.startStatusUpdateStream();
    }
  }

  protected stopStreamForEventType(eventType: StreamEventType): void {
    if (eventType === 'serviceStatus' || eventType === 'connectionStatus') {
      // Only stop status stream if no service or connection subscribers
      const serviceSubscribers =
        this.subscribers.get('serviceStatus')?.size || 0;
      const connectionSubscribers =
        this.subscribers.get('connectionStatus')?.size || 0;
      if (serviceSubscribers === 0 && connectionSubscribers === 0) {
        const interval = this.intervals.get('statusUpdate');
        if (interval) {
          clearInterval(interval);
          this.intervals.delete('statusUpdate');
        }
      }
    }
  }

  private startStatusUpdateStream(): void {
    // Don't start if already running
    if (this.intervals.has('statusUpdate')) {
      return;
    }

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
}

// Create singleton instance
export const statusService = new StatusService();

export default StatusService;
