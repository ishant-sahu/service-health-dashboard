import React, { useEffect, useState, useCallback } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  X,
  Activity,
  Clock,
  AlertTriangle,
  TrendingUp,
  Server,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { RealTimeChart, ChartDataPoint } from './charts';

type ServiceItem = {
  type: 'service';
  data: {
    name: string;
    tech: string;
    version: string;
    status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
    parent: string;
  };
};

type ConnectionItem = {
  type: 'connection';
  data: {
    source: string;
    target: string;
    status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  };
};

type SelectedItem = ServiceItem | ConnectionItem | null;

export default function DetailsPanel({
  selectedItem,
  realTimeMetrics,
  onClose,
}: {
  selectedItem: SelectedItem;
  realTimeMetrics: {
    rps: number;
    latency: number;
    errorRate: number;
  };
  onClose: () => void;
}): React.JSX.Element {
  const [metrics, setMetrics] = useState(realTimeMetrics);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Add new data point to chart data
  const addDataPoint = useCallback((newMetrics: typeof realTimeMetrics) => {
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
      // Keep only last 20 data points for performance
      return updated.slice(-20);
    });
  }, []);

  // Clear chart data when selected item changes
  useEffect(() => {
    setChartData([]);
  }, [selectedItem]);

  useEffect(() => {
    setMetrics(realTimeMetrics);
    // Only add to chart if we have valid metrics (not the default zeros)
    if (
      realTimeMetrics.rps > 0 ||
      realTimeMetrics.latency > 0 ||
      realTimeMetrics.errorRate > 0
    ) {
      addDataPoint(realTimeMetrics);
    }
  }, [realTimeMetrics, addDataPoint]);

  if (!selectedItem) {
    return (
      <Card className="w-80 h-full border-l bg-card/95 backdrop-blur">
        <div className="p-6 text-center text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a service or connection to view details</p>
        </div>
      </Card>
    );
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Card
      className={`${
        isMobile
          ? 'w-full h-full fixed top-0 right-0 z-50'
          : 'w-96 h-full border-l'
      } bg-card/95 backdrop-blur overflow-y-auto`}
    >
      <div
        className={`${
          isMobile ? 'p-4' : 'p-6'
        } border-b flex items-center justify-between`}
      >
        <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
          Details Panel
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className={`${isMobile ? 'p-4 space-y-6' : 'p-6 space-y-8'}`}>
        {selectedItem.type === 'service' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Server className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Service Details</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="text-sm font-medium">{selectedItem.data.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Type
                </label>
                <Badge variant="outline" className="ml-2">
                  {selectedItem.data.tech}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Version
                </label>
                <p className="text-sm">{selectedItem.data.version}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedItem.data.status === 'HEALTHY'
                        ? 'bg-green-500'
                        : selectedItem.data.status === 'DEGRADED'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <Badge
                    variant={
                      selectedItem.data.status === 'HEALTHY'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {selectedItem.data.status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Environment
                </label>
                <p className="text-sm">
                  {selectedItem.data.parent === 'prod-env'
                    ? 'Production'
                    : 'Staging'}
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedItem.type === 'connection' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Connection Details</h3>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Source Service
                </label>
                <p className="text-sm font-medium">
                  {selectedItem.data.source}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Target Service
                </label>
                <p className="text-sm font-medium">
                  {selectedItem.data.target}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Connection Status
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedItem.data.status === 'HEALTHY'
                        ? 'bg-green-500'
                        : selectedItem.data.status === 'DEGRADED'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <Badge
                    variant={
                      selectedItem.data.status === 'HEALTHY'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {selectedItem.data.status}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Real-time Metrics</h4>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>

              {/* Current Metrics Cards */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <Card className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-medium">RPS</span>
                  </div>
                  <span className="text-lg font-bold text-blue-500">
                    {metrics.rps || 0}
                  </span>
                </Card>

                <Card className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-medium">Latency</span>
                  </div>
                  <span className="text-lg font-bold text-green-500">
                    {metrics.latency || 0}ms
                  </span>
                </Card>

                <Card className="p-2 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span className="text-xs font-medium">Errors</span>
                  </div>
                  <span className="text-lg font-bold text-amber-500">
                    {metrics.errorRate || 0}%
                  </span>
                </Card>
              </div>

              {/* Real-time Charts */}
              {chartData.length > 0 && (
                <div className="space-y-4">
                  <RealTimeChart
                    data={chartData}
                    dataKey="rps"
                    color="#3b82f6"
                    type="area"
                    title="Requests per Second"
                    height={150}
                  />

                  <RealTimeChart
                    data={chartData}
                    dataKey="latency"
                    color="#10b981"
                    type="line"
                    title="Response Latency"
                    height={150}
                  />

                  <RealTimeChart
                    data={chartData}
                    dataKey="errorRate"
                    color="#f59e0b"
                    type="area"
                    title="Error Rate"
                    height={150}
                  />
                </div>
              )}

              <div className="mt-4 text-xs text-muted-foreground text-center">
                {chartData.length > 0
                  ? `Showing last ${chartData.length} data points • Updates every 2-3 seconds`
                  : 'Waiting for real-time data...'}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
