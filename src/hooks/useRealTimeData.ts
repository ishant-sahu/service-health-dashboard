import { useState, useEffect, useCallback, useRef } from 'react';
import { SERVICE_STATUS } from '../constants/dashboard';
import {
  dataStreamManager,
  StreamEvent,
  ServiceMetrics,
  ServiceStatusUpdate,
  ConnectionStatusUpdate,
  StreamConfig,
} from '../services/DataStreamManager';

export interface RealTimeDataState {
  metrics: Record<string, ServiceMetrics>;
  serviceStatuses: Record<
    string,
    (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS]
  >;
  connectionStatuses: Record<
    string,
    (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS]
  >;
  isConnected: boolean;
  lastUpdate: number;
}

export interface UseRealTimeDataOptions {
  serviceIds?: string[];
  connectionIds?: string[];
  config?: Partial<StreamConfig>;
  autoStart?: boolean;
}

export interface UseRealTimeDataReturn {
  data: RealTimeDataState;
  start: () => void;
  stop: () => void;
  updateConfig: (config: Partial<StreamConfig>) => void;
  updateServiceIds: (serviceIds: string[]) => void;
  updateConnectionIds: (connectionIds: string[]) => void;
  isActive: boolean;
}

/**
 * Custom hook for managing real-time data streams
 */
export const useRealTimeData = (
  options: UseRealTimeDataOptions = {}
): UseRealTimeDataReturn => {
  const {
    serviceIds = [],
    connectionIds = [],
    config = {},
    autoStart = true,
  } = options;

  const [data, setData] = useState<RealTimeDataState>({
    metrics: {},
    serviceStatuses: {},
    connectionStatuses: {},
    isConnected: false,
    lastUpdate: 0,
  });

  const [isActive, setIsActive] = useState(false);
  const unsubscribeRefs = useRef<(() => void)[]>([]);

  // Update service and connection IDs when they change
  useEffect(() => {
    if (serviceIds.length > 0) {
      dataStreamManager.setServiceIds(serviceIds);
    }
    if (connectionIds.length > 0) {
      dataStreamManager.setConnectionIds(connectionIds);
    }
  }, [serviceIds, connectionIds]);

  // Handle metrics updates
  const handleMetricsUpdate = useCallback((event: StreamEvent) => {
    const metrics = event.data as ServiceMetrics;
    setData((prev) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [Date.now().toString()]: metrics, // Use timestamp as key for multiple metrics
      },
      lastUpdate: event.timestamp,
    }));
  }, []);

  // Handle service status updates
  const handleServiceStatusUpdate = useCallback((event: StreamEvent) => {
    const statusUpdate = event.data as ServiceStatusUpdate;
    setData((prev) => ({
      ...prev,
      serviceStatuses: {
        ...prev.serviceStatuses,
        [statusUpdate.serviceId]: statusUpdate.status,
      },
      lastUpdate: event.timestamp,
    }));
  }, []);

  // Handle connection status updates
  const handleConnectionStatusUpdate = useCallback((event: StreamEvent) => {
    const statusUpdate = event.data as ConnectionStatusUpdate;
    setData((prev) => ({
      ...prev,
      connectionStatuses: {
        ...prev.connectionStatuses,
        [statusUpdate.connectionId]: statusUpdate.status,
      },
      lastUpdate: event.timestamp,
    }));
  }, []);

  // Start the data stream
  const start = useCallback(() => {
    if (isActive) return;

    // Update configuration if provided
    if (Object.keys(config).length > 0) {
      dataStreamManager.updateConfig(config);
    }

    // Subscribe to events
    const unsubscribeMetrics = dataStreamManager.subscribe(
      'metrics',
      handleMetricsUpdate
    );
    const unsubscribeServiceStatus = dataStreamManager.subscribe(
      'serviceStatus',
      handleServiceStatusUpdate
    );
    const unsubscribeConnectionStatus = dataStreamManager.subscribe(
      'connectionStatus',
      handleConnectionStatusUpdate
    );

    // Store unsubscribe functions
    unsubscribeRefs.current = [
      unsubscribeMetrics,
      unsubscribeServiceStatus,
      unsubscribeConnectionStatus,
    ];

    // Start the stream
    dataStreamManager.start();
    setIsActive(true);
    setData((prev) => ({ ...prev, isConnected: true }));
  }, [
    isActive,
    config,
    handleMetricsUpdate,
    handleServiceStatusUpdate,
    handleConnectionStatusUpdate,
  ]);

  // Stop the data stream
  const stop = useCallback(() => {
    if (!isActive) return;

    // Unsubscribe from events
    unsubscribeRefs.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeRefs.current = [];

    // Stop the stream
    dataStreamManager.stop();
    setIsActive(false);
    setData((prev) => ({ ...prev, isConnected: false }));
  }, [isActive]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<StreamConfig>) => {
    dataStreamManager.updateConfig(newConfig);
  }, []);

  // Update service IDs
  const updateServiceIds = useCallback((newServiceIds: string[]) => {
    dataStreamManager.setServiceIds(newServiceIds);
  }, []);

  // Update connection IDs
  const updateConnectionIds = useCallback((newConnectionIds: string[]) => {
    dataStreamManager.setConnectionIds(newConnectionIds);
  }, []);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !isActive) {
      start();
    }
  }, [autoStart, isActive, start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    data,
    start,
    stop,
    updateConfig,
    updateServiceIds,
    updateConnectionIds,
    isActive,
  };
};

/**
 * Hook for getting metrics for a specific service/connection
 */
export const useMetrics = (
  _id: string,
  options: UseRealTimeDataOptions = {}
) => {
  const { data } = useRealTimeData(options);

  // Get the latest metrics for the specific ID
  const latestMetrics = Object.values(data.metrics).pop() as
    | ServiceMetrics
    | undefined;

  return {
    metrics: latestMetrics,
    isConnected: data.isConnected,
    lastUpdate: data.lastUpdate,
  };
};

/**
 * Hook for getting status for a specific service
 */
export const useServiceStatus = (
  serviceId: string,
  options: UseRealTimeDataOptions = {}
) => {
  const { data } = useRealTimeData(options);

  return {
    status: data.serviceStatuses[serviceId],
    isConnected: data.isConnected,
    lastUpdate: data.lastUpdate,
  };
};

/**
 * Hook for getting status for a specific connection
 */
export const useConnectionStatus = (
  connectionId: string,
  options: UseRealTimeDataOptions = {}
) => {
  const { data } = useRealTimeData(options);

  return {
    status: data.connectionStatuses[connectionId],
    isConnected: data.isConnected,
    lastUpdate: data.lastUpdate,
  };
};
