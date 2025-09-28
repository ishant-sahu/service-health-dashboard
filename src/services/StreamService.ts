/**
 * Base class for stream services that manage subscribers and intervals
 * Provides common functionality for event-driven services
 */
export abstract class StreamService<TEvent, TConfig> {
  protected config: TConfig;
  protected subscribers: Set<(event: TEvent) => void> = new Set();
  protected interval: NodeJS.Timeout | null = null;
  protected isRunning: boolean = false;

  constructor(config: TConfig) {
    this.config = config;
  }

  /**
   * Start the service
   */
  start(): void {
    if (this.isRunning) {
      console.warn(`${this.constructor.name} is already running`);
      return;
    }

    this.isRunning = true;
    this.startStream();
  }

  /**
   * Stop the service
   */
  stop(): void {
    if (!this.isRunning) {
      console.warn(`${this.constructor.name} is not running`);
      return;
    }

    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Subscribe to events
   */
  subscribe(handler: (event: TEvent) => void): () => void {
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
  updateConfig(newConfig: Partial<TConfig>): void {
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
  getConfig(): TConfig {
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

  /**
   * Emit an event to all subscribers
   */
  protected emit(event: TEvent): void {
    this.subscribers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error(
          `Error in ${this.constructor.name} event handler:`,
          error
        );
      }
    });
  }

  /**
   * Abstract method to start the specific stream
   * Must be implemented by subclasses
   */
  protected abstract startStream(): void;
}

/**
 * Base class for multi-event stream services that manage multiple event types
 * Provides common functionality for services that handle different event types
 */
export abstract class MultiEventStreamService<TEvent, TEventType, TConfig> {
  protected config: TConfig;
  protected subscribers: Map<TEventType, Set<(event: TEvent) => void>> =
    new Map();
  protected intervals: Map<string, NodeJS.Timeout> = new Map();
  protected isRunning: boolean = false;

  constructor(config: TConfig) {
    this.config = config;
  }

  /**
   * Start the service
   */
  start(): void {
    if (this.isRunning) {
      console.warn(`${this.constructor.name} is already running`);
      return;
    }

    this.isRunning = true;
    this.startStreams();
  }

  /**
   * Stop the service
   */
  stop(): void {
    if (!this.isRunning) {
      console.warn(`${this.constructor.name} is not running`);
      return;
    }

    this.isRunning = false;
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
  }

  /**
   * Subscribe to specific event type
   */
  subscribe(
    eventType: TEventType,
    handler: (event: TEvent) => void
  ): () => void {
    const subscribers = this.subscribers.get(eventType);
    if (!subscribers) {
      throw new Error(`Unknown event type: ${eventType}`);
    }

    const wasEmpty = subscribers.size === 0;
    subscribers.add(handler);

    // Start the appropriate stream if this is the first subscriber
    if (wasEmpty && this.isRunning) {
      this.startStreamForEventType(eventType);
    }

    // Return unsubscribe function
    return () => {
      subscribers.delete(handler);

      // Stop the stream if no more subscribers for this event type
      if (subscribers.size === 0 && this.isRunning) {
        this.stopStreamForEventType(eventType);
      }
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<TConfig>): void {
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
  getConfig(): TConfig {
    return { ...this.config };
  }

  /**
   * Check if the service is running
   */
  isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Get current subscriber count for a specific event type
   */
  getSubscriberCount(eventType: TEventType): number {
    return this.subscribers.get(eventType)?.size || 0;
  }

  /**
   * Get total subscriber count across all event types
   */
  getTotalSubscriberCount(): number {
    let total = 0;
    this.subscribers.forEach((subs) => {
      total += subs.size;
    });
    return total;
  }

  /**
   * Emit an event to subscribers of a specific event type
   */
  protected emit(eventType: TEventType, event: TEvent): void {
    const subscribers = this.subscribers.get(eventType);
    if (subscribers) {
      subscribers.forEach((handler) => {
        try {
          handler(event);
        } catch (error) {
          console.error(
            `Error in ${this.constructor.name} event handler for ${eventType}:`,
            error
          );
        }
      });
    }
  }

  /**
   * Abstract method to start streams for all event types
   * Must be implemented by subclasses
   */
  protected abstract startStreams(): void;

  /**
   * Abstract method to start stream for specific event type
   * Must be implemented by subclasses
   */
  protected abstract startStreamForEventType(eventType: TEventType): void;

  /**
   * Abstract method to stop stream for specific event type
   * Must be implemented by subclasses
   */
  protected abstract stopStreamForEventType(eventType: TEventType): void;
}
