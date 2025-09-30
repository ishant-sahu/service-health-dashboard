import React from 'react';
import { Activity, PanelRightClose, PanelRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  HEADER_CONSTANTS,
  COLOR_CONSTANTS,
  DEVICE_TYPES,
} from '../constants/dashboard';
import { isMobile } from '../utils/responsive';

interface DashboardStats {
  total: number;
  healthy: number;
  degraded: number;
  offline: number;
}

interface DashboardHeaderProps {
  windowSize: {
    width: number;
    height: number;
  };
  dashboardStats: DashboardStats;
  isDarkMode: boolean;
  isPanelOpen: boolean;
  onToggleDarkMode: () => void;
  onTogglePanel: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  windowSize,
  dashboardStats,
  isDarkMode,
  isPanelOpen,
  onToggleDarkMode,
  onTogglePanel,
}) => {
  const isMobileDevice = isMobile(windowSize.width);
  const deviceType = isMobileDevice
    ? DEVICE_TYPES.MOBILE
    : DEVICE_TYPES.DESKTOP;

  return (
    <header
      className={`${HEADER_CONSTANTS.LAYOUT.HEADER_CLASSES} ${HEADER_CONSTANTS.PADDING[deviceType]}`}
      role="banner"
    >
      <div
        className={`${HEADER_CONSTANTS.LAYOUT.FLEX_CONTAINER} ${HEADER_CONSTANTS.GAPS.XLARGE}`}
      >
        <div
          className={`${HEADER_CONSTANTS.LAYOUT.TITLE_CONTAINER} ${HEADER_CONSTANTS.GAPS.XLARGE} ${HEADER_CONSTANTS.GAPS.XXLARGE}`}
        >
          <div className={`flex items-center ${HEADER_CONSTANTS.GAPS.LARGE}`}>
            <Activity
              className={`${HEADER_CONSTANTS.ICON_SIZES[deviceType]} text-primary`}
              aria-hidden="true"
            />
            <h1
              className={`${HEADER_CONSTANTS.TITLE_SIZES[deviceType]} font-bold`}
            >
              {HEADER_CONSTANTS.TEXTS.TITLE}
            </h1>
          </div>

          <div
            className={`${HEADER_CONSTANTS.LAYOUT.STATS_CONTAINER} ${HEADER_CONSTANTS.RESPONSIVE_GAPS.MOBILE} ${HEADER_CONSTANTS.RESPONSIVE_GAPS.DESKTOP}`}
            role="region"
            aria-label="Service status summary"
          >
            <Card
              className={`${HEADER_CONSTANTS.STAT_CARD_PADDING[deviceType]} ${COLOR_CONSTANTS.STATUS_BACKGROUNDS.HEALTHY} ${COLOR_CONSTANTS.STATUS_BORDERS.HEALTHY}`}
              role="status"
              aria-label={`${dashboardStats.healthy} healthy services`}
            >
              <div
                className={`flex items-center ${HEADER_CONSTANTS.GAPS.SMALL} ${HEADER_CONSTANTS.GAPS.MEDIUM}`}
              >
                <div
                  className={`${HEADER_CONSTANTS.STAT_DOT_SIZES[deviceType]} ${COLOR_CONSTANTS.STATUS_DOTS.HEALTHY} ${HEADER_CONSTANTS.LAYOUT.STAT_CARD_CLASSES}`}
                  aria-hidden="true"
                ></div>
                <span
                  className={`${HEADER_CONSTANTS.STAT_TEXT_SIZES[deviceType]} font-medium`}
                >
                  {dashboardStats.healthy} {HEADER_CONSTANTS.TEXTS.HEALTHY}
                </span>
              </div>
            </Card>

            <Card
              className={`${HEADER_CONSTANTS.STAT_CARD_PADDING[deviceType]} ${COLOR_CONSTANTS.STATUS_BACKGROUNDS.DEGRADED} ${COLOR_CONSTANTS.STATUS_BORDERS.DEGRADED}`}
              role="status"
              aria-label={`${dashboardStats.degraded} degraded services`}
            >
              <div
                className={`flex items-center ${HEADER_CONSTANTS.GAPS.SMALL} ${HEADER_CONSTANTS.GAPS.MEDIUM}`}
              >
                <div
                  className={`${HEADER_CONSTANTS.STAT_DOT_SIZES[deviceType]} ${COLOR_CONSTANTS.STATUS_DOTS.DEGRADED} ${HEADER_CONSTANTS.LAYOUT.STAT_CARD_CLASSES}`}
                  aria-hidden="true"
                ></div>
                <span
                  className={`${HEADER_CONSTANTS.STAT_TEXT_SIZES[deviceType]} font-medium`}
                >
                  {dashboardStats.degraded} {HEADER_CONSTANTS.TEXTS.DEGRADED}
                </span>
              </div>
            </Card>

            <Card
              className={`${HEADER_CONSTANTS.STAT_CARD_PADDING[deviceType]} ${COLOR_CONSTANTS.STATUS_BACKGROUNDS.OFFLINE} ${COLOR_CONSTANTS.STATUS_BORDERS.OFFLINE}`}
              role="status"
              aria-label={`${dashboardStats.offline} offline services`}
            >
              <div
                className={`flex items-center ${HEADER_CONSTANTS.GAPS.SMALL} ${HEADER_CONSTANTS.GAPS.MEDIUM}`}
              >
                <div
                  className={`${HEADER_CONSTANTS.STAT_DOT_SIZES[deviceType]} ${COLOR_CONSTANTS.STATUS_DOTS.OFFLINE} ${HEADER_CONSTANTS.LAYOUT.STAT_CARD_CLASSES}`}
                  aria-hidden="true"
                ></div>
                <span
                  className={`${HEADER_CONSTANTS.STAT_TEXT_SIZES[deviceType]} font-medium`}
                >
                  {dashboardStats.offline} {HEADER_CONSTANTS.TEXTS.OFFLINE}
                </span>
              </div>
            </Card>
          </div>
        </div>

        <div
          className={`${HEADER_CONSTANTS.LAYOUT.BUTTONS_CONTAINER} ${HEADER_CONSTANTS.RESPONSIVE_GAPS.MOBILE} ${HEADER_CONSTANTS.RESPONSIVE_GAPS.DESKTOP}`}
          role="toolbar"
          aria-label="Dashboard controls"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleDarkMode}
            className={`${HEADER_CONSTANTS.BUTTON_SIZES[deviceType]}`}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode
              ? HEADER_CONSTANTS.TEXTS.LIGHT
              : HEADER_CONSTANTS.TEXTS.DARK}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePanel}
            className={`${HEADER_CONSTANTS.BUTTON_SIZES[deviceType]}`}
            aria-label={`${isPanelOpen ? 'Close' : 'Open'} details panel`}
            aria-expanded={isPanelOpen}
          >
            {isPanelOpen ? (
              <PanelRightClose
                className={`${HEADER_CONSTANTS.ICON_SIZES_BUTTON[deviceType]} ${
                  !isMobileDevice
                    ? HEADER_CONSTANTS.LAYOUT.BUTTON_ICON_SPACING
                    : ''
                }`}
                aria-hidden="true"
              />
            ) : (
              <PanelRight
                className={`${HEADER_CONSTANTS.ICON_SIZES_BUTTON[deviceType]} ${
                  !isMobileDevice
                    ? HEADER_CONSTANTS.LAYOUT.BUTTON_ICON_SPACING
                    : ''
                }`}
                aria-hidden="true"
              />
            )}
            <span className={HEADER_CONSTANTS.LAYOUT.HIDDEN_MOBILE}>
              {HEADER_CONSTANTS.TEXTS.PANEL}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
