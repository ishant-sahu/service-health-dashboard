import React from 'react';
import { getBezierPath, Position } from 'reactflow';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type CustomEdgeProps = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  style?: React.CSSProperties;
  data?: {
    source: string;
    target: string;
    status: 'HEALTHY' | 'DEGRADED' | 'OFFLINE';
  };
  markerEnd?: string;
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}: CustomEdgeProps): React.JSX.Element => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <g>
          <path
            id={id}
            style={style}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
          />
          <path
            d={edgePath}
            fill="none"
            stroke="transparent"
            strokeWidth={20}
            className="react-flow__edge-interaction"
          />
        </g>
      </TooltipTrigger>
      <TooltipContent className="bg-card border text-foreground shadow-lg">
        <div className="space-y-1">
          <div className="font-semibold">Connection</div>
          <div className="text-xs text-muted-foreground">
            {data?.source || 'Unknown'} → {data?.target || 'Unknown'}
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                data?.status === 'HEALTHY'
                  ? 'bg-green-500'
                  : data?.status === 'DEGRADED'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-xs font-medium">
              {data?.status || 'Unknown'}
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default CustomEdge;
