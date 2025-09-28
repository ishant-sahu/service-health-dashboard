import { useState, useEffect, useCallback, useRef } from 'react';
import { SERVICE_STATUS } from '../constants/dashboard';
import {
  statusService,
  StreamEvent,
  ServiceStatusUpdate,
  ConnectionStatusUpdate,
  StreamConfig,
} from '../services/StatusService';

export interface StatusDataState {
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

export interface UseStatusUpdatesOptions {
  serviceIds?: string[];
  connectionIds?: string[];
  config?: Partial<StreamConfig>;
  autoStart?: boolean;
}

export interface UseStatusUpdatesReturn {
  data: StatusDataState;
  start: () => void;
  stop: () => void;
  updateConfig: (config: Partial<StreamConfig>) => void;
  updateServiceIds: (serviceIds: string[]) => void;
  updateConnectionIds: (connectionIds: string[]) => void;
  isActive: boolean;
}

/**
 * Custom hook for managing status updates for services and connections
 */
export const useStatusUpdates = (
  options: UseStatusUpdatesOptions = {}
): UseStatusUpdatesReturn => {
  const {
    serviceIds = [],
    connectionIds = [],
    config = {},
    autoStart = true,
  } = options;

  const [data, setData] = useState<StatusDataState>({
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
      statusService.setServiceIds(serviceIds);
    }
    if (connectionIds.length > 0) {
      statusService.setConnectionIds(connectionIds);
    }
  }, [serviceIds, connectionIds]);

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
      statusService.updateConfig(config);
    }

    // Subscribe to events
    const unsubscribeServiceStatus = statusService.subscribe(
      'serviceStatus',
      handleServiceStatusUpdate
    );
    const unsubscribeConnectionStatus = statusService.subscribe(
      'connectionStatus',
      handleConnectionStatusUpdate
    );

    // Store unsubscribe functions
    unsubscribeRefs.current = [
      unsubscribeServiceStatus,
      unsubscribeConnectionStatus,
    ];

    // Start the stream
    statusService.start();
    setIsActive(true);
    setData((prev) => ({ ...prev, isConnected: true }));
  }, [
    isActive,
    config,
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
    statusService.stop();
    setIsActive(false);
    setData((prev) => ({ ...prev, isConnected: false }));
  }, [isActive]);

  // Update configuration
  const updateConfig = useCallback((newConfig: Partial<StreamConfig>) => {
    statusService.updateConfig(newConfig);
  }, []);

  // Update service IDs
  const updateServiceIds = useCallback((newServiceIds: string[]) => {
    statusService.setServiceIds(newServiceIds);
  }, []);

  // Update connection IDs
  const updateConnectionIds = useCallback((newConnectionIds: string[]) => {
    statusService.setConnectionIds(newConnectionIds);
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
 * Hook for getting status for a specific service
 */
export const useServiceStatus = (
  serviceId: string,
  options: UseStatusUpdatesOptions = {}
) => {
  const { data } = useStatusUpdates(options);

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
  options: UseStatusUpdatesOptions = {}
) => {
  const { data } = useStatusUpdates(options);

  return {
    status: data.connectionStatuses[connectionId],
    isConnected: data.isConnected,
    lastUpdate: data.lastUpdate,
  };
};
