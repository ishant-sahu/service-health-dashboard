import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Cloud, TestTube } from 'lucide-react';
import {
  ENVIRONMENT_NODE_CONSTANTS,
  ENVIRONMENT_NAMES,
} from '../constants/dashboard';

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
  const isProduction = data.name === ENVIRONMENT_NAMES.PROD;
  const { containerHeight, isMobile = false, isTablet = false } = data;

  let containerWidth: number, height: number;

  if (isMobile) {
    const serviceWidth =
      ENVIRONMENT_NODE_CONSTANTS.SERVICE_DIMENSIONS.MOBILE_WIDTH;
    containerWidth =
      2 * serviceWidth +
      ENVIRONMENT_NODE_CONSTANTS.SPACING.MOBILE_SERVICE_SPACING +
      ENVIRONMENT_NODE_CONSTANTS.SPACING.MOBILE_PADDING;
    height =
      containerHeight ||
      (isProduction
        ? ENVIRONMENT_NODE_CONSTANTS.CONTAINER_DIMENSIONS.PRODUCTION_HEIGHT
            .MOBILE
        : ENVIRONMENT_NODE_CONSTANTS.CONTAINER_DIMENSIONS.STAGING_HEIGHT
            .MOBILE);
  } else if (isTablet) {
    const serviceWidth =
      ENVIRONMENT_NODE_CONSTANTS.SERVICE_DIMENSIONS.TABLET_WIDTH;
    const containerPadding = ENVIRONMENT_NODE_CONSTANTS.SPACING.TABLET_PADDING;
    // Calculate container width with generous spacing to prevent overflow
    const spacing = ENVIRONMENT_NODE_CONSTANTS.SPACING.TABLET_SERVICE_SPACING;
    const maxCol = ENVIRONMENT_NODE_CONSTANTS.GRID.TABLET_MAX_COL;
    const maxServiceX = containerPadding + maxCol * (serviceWidth + spacing);
    containerWidth =
      maxServiceX +
      serviceWidth +
      containerPadding +
      ENVIRONMENT_NODE_CONSTANTS.SPACING.TABLET_EXTRA_MARGIN;
    height =
      containerHeight ||
      (isProduction
        ? ENVIRONMENT_NODE_CONSTANTS.CONTAINER_DIMENSIONS.PRODUCTION_HEIGHT
            .TABLET
        : ENVIRONMENT_NODE_CONSTANTS.CONTAINER_DIMENSIONS.STAGING_HEIGHT
            .TABLET);
  } else {
    containerWidth =
      ENVIRONMENT_NODE_CONSTANTS.CONTAINER_DIMENSIONS.DESKTOP_WIDTH;
    height =
      containerHeight ||
      ENVIRONMENT_NODE_CONSTANTS.CONTAINER_DIMENSIONS.PRODUCTION_HEIGHT.DESKTOP;
  }

  return (
    <Card
      className={`
        ${ENVIRONMENT_NODE_CONSTANTS.LAYOUT.CARD_CLASSES}
        ${
          isProduction
            ? `${ENVIRONMENT_NODE_CONSTANTS.COLORS.PRODUCTION.BORDER} ${ENVIRONMENT_NODE_CONSTANTS.COLORS.PRODUCTION.BACKGROUND}`
            : `${ENVIRONMENT_NODE_CONSTANTS.COLORS.STAGING.BORDER} ${ENVIRONMENT_NODE_CONSTANTS.COLORS.STAGING.BACKGROUND}`
        }
      `}
      style={{
        zIndex: 0,
        width: `${containerWidth}px`,
        height: `${height}px`,
        minWidth: `${containerWidth}px`,
        minHeight: `${height}px`,
      }}
    >
      <div className={ENVIRONMENT_NODE_CONSTANTS.LAYOUT.HEADER_CLASSES}>
        {isProduction ? (
          <Cloud
            className={`${ENVIRONMENT_NODE_CONSTANTS.ICON_SIZES.MOBILE} ${ENVIRONMENT_NODE_CONSTANTS.ICON_SIZES.TABLET} ${ENVIRONMENT_NODE_CONSTANTS.ICON_SIZES.DESKTOP} ${ENVIRONMENT_NODE_CONSTANTS.COLORS.PRODUCTION.ICON}`}
          />
        ) : (
          <TestTube
            className={`${ENVIRONMENT_NODE_CONSTANTS.ICON_SIZES.MOBILE} ${ENVIRONMENT_NODE_CONSTANTS.ICON_SIZES.TABLET} ${ENVIRONMENT_NODE_CONSTANTS.ICON_SIZES.DESKTOP} ${ENVIRONMENT_NODE_CONSTANTS.COLORS.STAGING.ICON}`}
          />
        )}
        <h2
          className={`${ENVIRONMENT_NODE_CONSTANTS.TEXT_SIZES.TITLE_MOBILE} ${ENVIRONMENT_NODE_CONSTANTS.TEXT_SIZES.TITLE_TABLET} ${ENVIRONMENT_NODE_CONSTANTS.TEXT_SIZES.TITLE_DESKTOP} font-bold`}
        >
          {data.name}
        </h2>
        <Badge
          variant="outline"
          className={`
            ${
              isProduction
                ? `${ENVIRONMENT_NODE_CONSTANTS.COLORS.PRODUCTION.BADGE_BORDER} ${ENVIRONMENT_NODE_CONSTANTS.COLORS.PRODUCTION.BADGE_TEXT}`
                : `${ENVIRONMENT_NODE_CONSTANTS.COLORS.STAGING.BADGE_BORDER} ${ENVIRONMENT_NODE_CONSTANTS.COLORS.STAGING.BADGE_TEXT}`
            }
            ${ENVIRONMENT_NODE_CONSTANTS.TEXT_SIZES.BADGE_MOBILE} ${
            ENVIRONMENT_NODE_CONSTANTS.TEXT_SIZES.BADGE_TABLET
          } ${ENVIRONMENT_NODE_CONSTANTS.TEXT_SIZES.BADGE_DESKTOP} ${
            ENVIRONMENT_NODE_CONSTANTS.BADGE_PADDING.MOBILE
          } ${ENVIRONMENT_NODE_CONSTANTS.BADGE_PADDING.TABLET} ${
            ENVIRONMENT_NODE_CONSTANTS.BADGE_PADDING.DESKTOP
          }
          `}
        >
          {ENVIRONMENT_NODE_CONSTANTS.TEXTS.ENVIRONMENT}
        </Badge>
      </div>

      {/* <div className="text-base md:text-lg text-muted-foreground pl-1">
        Services and connections within this environment
      </div> */}
    </Card>
  );
}
