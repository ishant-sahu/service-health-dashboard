import React, { useEffect, useState } from 'react';
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
  realTimeMetrics: any;
  onClose: () => void;
}): React.JSX.Element {
  const [metrics, setMetrics] = useState(realTimeMetrics);

  useEffect(() => {
    setMetrics(realTimeMetrics);
  }, [realTimeMetrics]);

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

              <div className="space-y-4">
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Requests/sec</span>
                    </div>
                    <span className="text-lg font-bold text-blue-500">
                      {metrics.rps || 0}
                    </span>
                  </div>
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Avg Latency</span>
                    </div>
                    <span className="text-lg font-bold text-green-500">
                      {metrics.latency || 0}ms
                    </span>
                  </div>
                </Card>

                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium">Error Rate</span>
                    </div>
                    <span className="text-lg font-bold text-amber-500">
                      {metrics.errorRate || 0}%
                    </span>
                  </div>
                </Card>
              </div>

              <div className="mt-4 text-xs text-muted-foreground text-center">
                Updates every 2-3 seconds
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
