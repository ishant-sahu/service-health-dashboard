import React from 'react';
import { Handle, Position } from 'reactflow';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import {
  Server,
  Database,
  Layers,
  Monitor,
  Zap,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

type ServiceData = {
  name: string;
  tech: string;
  version: string;
  status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
};

function getServiceIcon(tech?: string): React.JSX.Element {
  switch (tech?.toLowerCase()) {
    case 'react':
      return <Monitor className="h-5 w-5" />;
    case 'node.js':
      return <Server className="h-5 w-5" />;
    case 'go':
      return <Zap className="h-5 w-5" />;
    case 'postgresql':
      return <Database className="h-5 w-5" />;
    case 'redis':
      return <Layers className="h-5 w-5" />;
    default:
      return <Server className="h-5 w-5" />;
  }
}

function getStatusIcon(status: ServiceData['status']): React.JSX.Element {
  switch (status) {
    case 'HEALTHY':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'DEGRADED':
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case 'OFFLINE':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
}

function getStatusColor(status: ServiceData['status']): string {
  switch (status) {
    case 'HEALTHY':
      return 'border-green-500 bg-green-500/10';
    case 'DEGRADED':
      return 'border-amber-500 bg-amber-500/10';
    case 'OFFLINE':
      return 'border-red-500 bg-red-500/10';
    default:
      return 'border-green-500 bg-green-500/10';
  }
}

export default function ServiceNode({
  data,
  selected,
}: {
  data: ServiceData;
  selected?: boolean;
}): React.JSX.Element {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card
          className={`
            ${
              isMobile
                ? 'min-w-[180px] w-[180px] p-4'
                : 'min-w-[240px] w-[240px] p-5'
            } 
            cursor-pointer transition-all duration-300 
            hover:shadow-xl hover:scale-105 hover:-translate-y-1
            ${getStatusColor(data.status)}
            ${selected ? 'ring-2 ring-primary shadow-xl scale-105' : ''}
            backdrop-blur-sm relative z-10
          `}
          style={{ zIndex: 10 }}
        >
          <Handle
            type="target"
            position={Position.Top}
            className="!bg-muted-foreground !border-2 !border-background !w-4 !h-4 !top-[-8px]"
          />

          <div
            className={`flex items-start gap-2 ${isMobile ? 'mb-2' : 'mb-3'}`}
          >
            <div
              className={`${
                isMobile ? 'p-1.5' : 'p-2'
              } rounded-lg bg-background/80 border`}
            >
              {getServiceIcon(data.tech)}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`${
                  isMobile ? 'text-xs' : 'text-sm'
                } font-bold truncate mb-1`}
              >
                {data.name}
              </h3>
              <p
                className={`${
                  isMobile ? 'text-xs' : 'text-xs'
                } text-muted-foreground`}
              >
                {data.tech}
              </p>
            </div>
            <div className="mt-1">{getStatusIcon(data.status)}</div>
          </div>

          <div
            className={`flex items-center justify-between gap-2 ${
              isMobile ? 'mt-3' : 'mt-4'
            }`}
          >
            <Badge
              variant="secondary"
              className={`${
                isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'
              }`}
            >
              v{data.version}
            </Badge>
            <Badge
              variant={data.status === 'HEALTHY' ? 'default' : 'destructive'}
              className={`${
                isMobile ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1'
              } font-medium`}
            >
              {data.status}
            </Badge>
          </div>

          <Handle
            type="source"
            position={Position.Bottom}
            className="!bg-muted-foreground !border-2 !border-background !w-4 !h-4 !bottom-[-8px]"
          />
        </Card>
      </TooltipTrigger>
      <TooltipContent className="bg-card border text-foreground shadow-lg">
        <div className="space-y-1">
          <div className="font-semibold">{data.name}</div>
          <div className="text-xs text-muted-foreground">
            {data.tech} v{data.version}
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                data.status === 'HEALTHY'
                  ? 'bg-green-500'
                  : data.status === 'DEGRADED'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-xs font-medium">{data.status}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
