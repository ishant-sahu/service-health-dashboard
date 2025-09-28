import React from 'react';
import { getBezierPath, Position } from 'reactflow';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { SERVICE_STATUS, COLOR_CONSTANTS } from '../constants/dashboard';

// Edge-specific constants
const EDGE_CONSTANTS = {
  INTERACTION_STROKE_WIDTH: 20,
  UNKNOWN_LABEL: 'Unknown',
  CONNECTION_LABEL: 'Connection',
  SELECTION_STROKE_WIDTH: 4,
  SELECTION_OPACITY: 1,
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
  selected?: boolean;
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
  selected = false,
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
          {/* Selection overlay - appears when edge is selected */}
          {selected && (
            <path
              d={edgePath}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={EDGE_CONSTANTS.SELECTION_STROKE_WIDTH}
              strokeOpacity={EDGE_CONSTANTS.SELECTION_OPACITY}
              className="react-flow__edge-selection"
              style={{
                filter: 'drop-shadow(0 0 6px hsl(var(--primary)))',
              }}
            />
          )}
          {/* Main edge path */}
          <path
            id={id}
            style={style}
            className="react-flow__edge-path"
            d={edgePath}
            markerEnd={markerEnd}
          />
          {/* Interaction area for clicking */}
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
