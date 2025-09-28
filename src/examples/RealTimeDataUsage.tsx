import React from 'react';
import {
  useRealTimeData,
  useServiceStatus,
  useConnectionStatus,
  useMetrics,
} from '../hooks/useRealTimeData';

/**
 * Example component showing how to use the real-time data hooks
 */
export const RealTimeDataUsageExample: React.FC = () => {
  // Example 1: Using the main hook with all data
  const { data, start, stop, isActive } = useRealTimeData({
    serviceIds: ['service-1', 'service-2'],
    connectionIds: ['conn-1', 'conn-2'],
    config: {
      metricsInterval: 2000,
      statusUpdateInterval: 3000,
    },
    autoStart: true,
  });

  // Example 2: Using specific hooks for individual services/connections
  const serviceStatus = useServiceStatus('service-1');
  const connectionStatus = useConnectionStatus('conn-1');
  const metrics = useMetrics('service-1');

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Real-Time Data Usage Examples</h2>

      {/* Connection Status */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Connection Status</h3>
        <p>Active: {isActive ? 'Yes' : 'No'}</p>
        <p>Connected: {data.isConnected ? 'Yes' : 'No'}</p>
        <p>Last Update: {new Date(data.lastUpdate).toLocaleTimeString()}</p>

        <div className="mt-2 space-x-2">
          <button
            onClick={start}
            disabled={isActive}
            className="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
          >
            Start Stream
          </button>
          <button
            onClick={stop}
            disabled={!isActive}
            className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
          >
            Stop Stream
          </button>
        </div>
      </div>

      {/* Service Statuses */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Service Statuses</h3>
        <div className="space-y-1">
          {Object.entries(data.serviceStatuses).map(([serviceId, status]) => (
            <div key={serviceId} className="flex justify-between">
              <span>{serviceId}:</span>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  status === 'HEALTHY'
                    ? 'bg-green-100 text-green-800'
                    : status === 'DEGRADED'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Connection Statuses */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Connection Statuses</h3>
        <div className="space-y-1">
          {Object.entries(data.connectionStatuses).map(
            ([connectionId, status]) => (
              <div key={connectionId} className="flex justify-between">
                <span>{connectionId}:</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    status === 'HEALTHY'
                      ? 'bg-green-100 text-green-800'
                      : status === 'DEGRADED'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {status}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Latest Metrics */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Latest Metrics</h3>
        {Object.entries(data.metrics)
          .slice(-3)
          .map(([timestamp, metrics]) => (
            <div key={timestamp} className="mt-2 p-2 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">
                {new Date(parseInt(timestamp)).toLocaleTimeString()}
              </p>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>RPS: {metrics.rps}</div>
                <div>Latency: {metrics.latency}ms</div>
                <div>Error Rate: {metrics.errorRate}%</div>
              </div>
            </div>
          ))}
      </div>

      {/* Individual Hook Examples */}
      <div className="p-4 border rounded">
        <h3 className="font-semibold">Individual Hook Examples</h3>
        <div className="space-y-2">
          <div>
            <strong>Service Status (service-1):</strong>{' '}
            {serviceStatus.status || 'Unknown'}
          </div>
          <div>
            <strong>Connection Status (conn-1):</strong>{' '}
            {connectionStatus.status || 'Unknown'}
          </div>
          <div>
            <strong>Latest Metrics:</strong>
            {metrics.metrics ? (
              <span className="ml-2">
                RPS: {metrics.metrics.rps}, Latency: {metrics.metrics.latency}
                ms, Error Rate: {metrics.metrics.errorRate}%
              </span>
            ) : (
              <span className="ml-2 text-gray-500">No metrics available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDataUsageExample;
