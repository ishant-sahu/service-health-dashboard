import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DetailsPanel from '../components/DetailsPanel';
import { RealTimeChart, ChartDataPoint } from '../components/charts';

/**
 * Example component demonstrating the DetailsPanel with real-time charts
 */
const DetailsPanelChartExample: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    rps: 0,
    latency: 0,
    errorRate: 0,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Mock connection data
  const mockConnections = [
    {
      type: 'connection',
      data: {
        source: 'user-service',
        target: 'auth-service',
        status: 'HEALTHY',
      },
    },
    {
      type: 'connection',
      data: {
        source: 'payment-service',
        target: 'billing-service',
        status: 'DEGRADED',
      },
    },
    {
      type: 'connection',
      data: {
        source: 'notification-service',
        target: 'email-service',
        status: 'HEALTHY',
      },
    },
  ];

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newMetrics = {
        rps: Math.floor(Math.random() * 1000) + 100,
        latency: Math.floor(Math.random() * 300) + 50,
        errorRate: Math.random() * 5,
      };

      setRealTimeMetrics(newMetrics);

      // Add to chart data for standalone chart demonstration
      const now = Date.now();
      const timeString = new Date(now).toLocaleTimeString();

      const newDataPoint: ChartDataPoint = {
        timestamp: now,
        time: timeString,
        rps: newMetrics.rps,
        latency: newMetrics.latency,
        errorRate: newMetrics.errorRate,
      };

      setChartData((prev) => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-20);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const [connectionIndex, setConnectionIndex] = useState(0);

  const handleSelectConnection = () => {
    setSelectedItem(mockConnections[connectionIndex]);
    setConnectionIndex((prev) => (prev + 1) % mockConnections.length);
  };

  const handleClosePanel = () => {
    setSelectedItem(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">DetailsPanel Chart Example</h1>
        <p className="text-muted-foreground">
          Demonstrating real-time charts in the DetailsPanel using recharts
        </p>
      </div>

      {/* Control Panel */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={handleSelectConnection}>
              Select Connection {connectionIndex + 1} (
              {mockConnections[connectionIndex].data.source} →{' '}
              {mockConnections[connectionIndex].data.target})
            </Button>
            <Button variant="outline" onClick={handleClosePanel}>
              Close Panel
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-500">
                {realTimeMetrics.rps}
              </div>
              <div className="text-sm text-muted-foreground">RPS</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-500">
                {realTimeMetrics.latency}ms
              </div>
              <div className="text-sm text-muted-foreground">Latency</div>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded">
              <div className="text-2xl font-bold text-amber-500">
                {realTimeMetrics.errorRate.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Error Rate</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Left Side - Instructions */}
        <div className="flex-1">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold">How to Use:</h3>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Click "Select Connection" to open the DetailsPanel</li>
                  <li>View the real-time metrics cards at the top</li>
                  <li>Watch the charts update automatically every 2 seconds</li>
                  <li>Charts show the last 20 data points</li>
                  <li>
                    Switch between different connections to see chart data reset
                  </li>
                  <li>Click "Close Panel" to hide the panel</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold">Chart Features:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>
                    <strong>RPS Chart:</strong> Area chart showing requests per
                    second
                  </li>
                  <li>
                    <strong>Latency Chart:</strong> Line chart showing response
                    times
                  </li>
                  <li>
                    <strong>Error Rate Chart:</strong> Area chart showing error
                    percentages
                  </li>
                  <li>
                    <strong>Real-time Updates:</strong> Charts update
                    automatically
                  </li>
                  <li>
                    <strong>Responsive Design:</strong> Adapts to different
                    screen sizes
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold">Technical Details:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Built with recharts library</li>
                  <li>Uses React hooks for state management</li>
                  <li>Optimized for performance with data point limits</li>
                  <li>Dark theme compatible</li>
                  <li>Mobile responsive design</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side - DetailsPanel */}
        <div className="w-96">
          <DetailsPanel
            selectedItem={selectedItem}
            realTimeMetrics={realTimeMetrics}
            onClose={handleClosePanel}
          />
        </div>
      </div>

      {/* Standalone Chart Demonstration */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Standalone RealTimeChart Component
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          The RealTimeChart component can be used independently outside of the
          DetailsPanel:
        </p>

        {chartData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RealTimeChart
              data={chartData}
              dataKey="rps"
              color="#3b82f6"
              type="area"
              title="Standalone RPS Chart"
              height={200}
            />

            <RealTimeChart
              data={chartData}
              dataKey="latency"
              color="#10b981"
              type="line"
              title="Standalone Latency Chart"
              height={200}
            />
          </div>
        )}
      </Card>

      {/* Chart Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Chart Implementation Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">RealTimeChart Component</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Based on the provided VirtualizedChart reference:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Supports both line and area chart types</li>
                <li>Uses ResponsiveContainer for adaptive sizing</li>
                <li>Customizable colors and heights</li>
                <li>Optimized for real-time data updates</li>
                <li>Disabled animations for better performance</li>
                <li>Now available as a separate reusable component</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Data Management</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Efficient data handling:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Maintains last 20 data points</li>
                <li>Automatic cleanup of old data</li>
                <li>Timestamp-based data points</li>
                <li>Real-time metric updates</li>
                <li>Performance optimized rendering</li>
                <li>Modular architecture for reusability</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailsPanelChartExample;
