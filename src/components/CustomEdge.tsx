import React from 'react';
import { getBezierPath, Position } from 'reactflow';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { SERVICE_STATUS, COLOR_CONSTANTS } from '../constants/dashboard';

// Edge-specific constants
const EDGE_CONSTANTS = {
  INTERACTION_STROKE_WIDTH: 20,
  UNKNOWN_LABEL: 'Unknown',
  CONNECTION_LABEL: 'Connection',
} as const;

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
    status: (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];
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
            strokeWidth={EDGE_CONSTANTS.INTERACTION_STROKE_WIDTH}
            className="react-flow__edge-interaction"
          />
        </g>
      </TooltipTrigger>
      <TooltipContent className="bg-card border text-foreground shadow-lg">
        <div className="space-y-1">
          <div className="font-semibold">{EDGE_CONSTANTS.CONNECTION_LABEL}</div>
          <div className="text-xs text-muted-foreground">
            {data?.source || EDGE_CONSTANTS.UNKNOWN_LABEL} →{' '}
            {data?.target || EDGE_CONSTANTS.UNKNOWN_LABEL}
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                data?.status === SERVICE_STATUS.HEALTHY
                  ? COLOR_CONSTANTS.STATUS_DOTS.HEALTHY
                  : data?.status === SERVICE_STATUS.DEGRADED
                  ? COLOR_CONSTANTS.STATUS_DOTS.DEGRADED
                  : COLOR_CONSTANTS.STATUS_DOTS.OFFLINE
              }`}
            />
            <span className="text-xs font-medium">
              {data?.status || EDGE_CONSTANTS.UNKNOWN_LABEL}
            </span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default CustomEdge;
