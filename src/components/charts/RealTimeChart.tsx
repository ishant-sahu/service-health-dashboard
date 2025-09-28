import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export interface ChartDataPoint {
  timestamp: number;
  time: string;
  rps: number;
  latency: number;
  errorRate: number;
}

interface RealTimeChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  color: string;
  type?: 'line' | 'area';
  title: string;
  height?: number;
}

/**
 * Real-time chart component based on VirtualizedChart reference
 * Supports both line and area chart types for real-time data visualization
 */
export const RealTimeChart: React.FC<RealTimeChartProps> = ({
  data,
  dataKey,
  color,
  type = 'line',
  title,
  height = 200,
}) => {
  const chartData = useMemo(() => {
    if (!data.length) return [];

    return data.map((item, index) => ({
      timestamp: item.time,
      value: item[dataKey as keyof ChartDataPoint] as number,
      index,
    }));
  }, [data, dataKey]);

  const ChartComponent = type === 'area' ? AreaChart : LineChart;

  return (
    <div className="bg-card rounded-lg border p-4">
      <h4 className="text-sm font-semibold mb-3 capitalize text-foreground">
        {title}
      </h4>
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
          <XAxis
            dataKey="timestamp"
            stroke="#666"
            fontSize={10}
            interval="preserveStartEnd"
            tickFormatter={(value) => value.split(':').slice(1).join(':')}
          />
          <YAxis stroke="#666" fontSize={10} />
          {type === 'area' ? (
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color + '30'}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default RealTimeChart;
