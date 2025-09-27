import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Cloud, TestTube } from 'lucide-react';

export default function EnvironmentNode({
  data,
}: {
  data: {
    name: string;
    containerHeight?: number;
    isMobile?: boolean;
    isTablet?: boolean;
    windowWidth?: number;
  };
}): React.JSX.Element {
  const isProduction = data.name === 'Production';
  const {
    containerHeight,
    isMobile = false,
    isTablet = false,
    windowWidth = window.innerWidth,
  } = data;

  let containerWidth: number, height: number;

  if (isMobile) {
    const serviceWidth = 180; // Fixed width for mobile services
    containerWidth = 2 * serviceWidth + 40 + 40; // Two services + 40px spacing + 40px padding
    height = containerHeight || (isProduction ? 700 : 350);
  } else if (isTablet) {
    const serviceWidth = 200;
    const containerPadding = 30;
    // Calculate container width with generous spacing to prevent overflow
    const spacing = 80; // Increased spacing between services
    const maxCol = 1; // For 2 columns, max column index is 1
    const maxServiceX = containerPadding + maxCol * (serviceWidth + spacing); // containerPadding + maxCol * (serviceWidth + spacing)
    containerWidth = maxServiceX + serviceWidth + containerPadding + 50; // maxX + serviceWidth + rightPadding + extra margin
    height = containerHeight || (isProduction ? 600 : 300);
  } else {
    containerWidth = 1200;
    height = containerHeight || 500;
  }

  return (
    <Card
      className={`
        p-6 
        ${
          isProduction
            ? 'border-blue-500/30 bg-blue-500/5'
            : 'border-purple-500/30 bg-purple-500/5'
        }
        relative backdrop-blur-sm z-0
      `}
      style={{
        zIndex: 0,
        width: `${containerWidth}px`,
        height: `${height}px`,
        minWidth: `${containerWidth}px`,
        minHeight: `${height}px`,
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        {isProduction ? (
          <Cloud className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 text-blue-500" />
        ) : (
          <TestTube className="h-7 w-7 md:h-8 md:w-8 lg:h-9 lg:w-9 text-purple-500" />
        )}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
          {data.name}
        </h2>
        <Badge
          variant="outline"
          className={`
            ${
              isProduction
                ? 'border-blue-500 text-blue-500'
                : 'border-purple-500 text-purple-500'
            }
            text-sm md:text-base lg:text-lg px-3 md:px-4 lg:px-5 py-1.5 md:py-2
          `}
        >
          Environment
        </Badge>
      </div>

      {/* <div className="text-base md:text-lg text-muted-foreground pl-1">
        Services and connections within this environment
      </div> */}
    </Card>
  );
}
