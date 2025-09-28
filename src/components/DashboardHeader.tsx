import React from 'react';
import { Activity, PanelRightClose, PanelRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  HEADER_CONSTANTS,
  COLOR_CONSTANTS,
  SERVICE_STATUS,
} from '../constants/dashboard';

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
  const isMobile = windowSize.width < 768;

  return (
    <header
      className={`border-b bg-card/95 backdrop-blur-sm ${
        isMobile
          ? HEADER_CONSTANTS.PADDING.MOBILE
          : HEADER_CONSTANTS.PADDING.DESKTOP
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between max-w-full gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <Activity
              className={`${
                isMobile
                  ? HEADER_CONSTANTS.ICON_SIZES.MOBILE
                  : HEADER_CONSTANTS.ICON_SIZES.DESKTOP
              } text-primary`}
            />
            <h1
              className={`${
                isMobile
                  ? HEADER_CONSTANTS.TITLE_SIZES.MOBILE
                  : HEADER_CONSTANTS.TITLE_SIZES.DESKTOP
              } font-bold`}
            >
              Service Health Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            <Card
              className={`${
                HEADER_CONSTANTS.STAT_CARD_PADDING[
                  isMobile ? 'MOBILE' : 'DESKTOP'
                ]
              } ${COLOR_CONSTANTS.STATUS_BACKGROUNDS.HEALTHY} ${
                COLOR_CONSTANTS.STATUS_BORDERS.HEALTHY
              }`}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <div
                  className={`${
                    HEADER_CONSTANTS.STAT_DOT_SIZES[
                      isMobile ? 'MOBILE' : 'DESKTOP'
                    ]
                  } ${
                    COLOR_CONSTANTS.STATUS_DOTS.HEALTHY
                  } rounded-full animate-pulse`}
                ></div>
                <span
                  className={`${
                    HEADER_CONSTANTS.STAT_TEXT_SIZES[
                      isMobile ? 'MOBILE' : 'DESKTOP'
                    ]
                  } font-medium`}
                >
                  {dashboardStats.healthy} Healthy
                </span>
              </div>
            </Card>

            <Card
              className={`${
                HEADER_CONSTANTS.STAT_CARD_PADDING[
                  isMobile ? 'MOBILE' : 'DESKTOP'
                ]
              } ${COLOR_CONSTANTS.STATUS_BACKGROUNDS.DEGRADED} ${
                COLOR_CONSTANTS.STATUS_BORDERS.DEGRADED
              }`}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <div
                  className={`${
                    HEADER_CONSTANTS.STAT_DOT_SIZES[
                      isMobile ? 'MOBILE' : 'DESKTOP'
                    ]
                  } ${
                    COLOR_CONSTANTS.STATUS_DOTS.DEGRADED
                  } rounded-full animate-pulse`}
                ></div>
                <span
                  className={`${
                    HEADER_CONSTANTS.STAT_TEXT_SIZES[
                      isMobile ? 'MOBILE' : 'DESKTOP'
                    ]
                  } font-medium`}
                >
                  {dashboardStats.degraded} Degraded
                </span>
              </div>
            </Card>

            <Card
              className={`${
                HEADER_CONSTANTS.STAT_CARD_PADDING[
                  isMobile ? 'MOBILE' : 'DESKTOP'
                ]
              } ${COLOR_CONSTANTS.STATUS_BACKGROUNDS.OFFLINE} ${
                COLOR_CONSTANTS.STATUS_BORDERS.OFFLINE
              }`}
            >
              <div className="flex items-center gap-1 md:gap-2">
                <div
                  className={`${
                    HEADER_CONSTANTS.STAT_DOT_SIZES[
                      isMobile ? 'MOBILE' : 'DESKTOP'
                    ]
                  } ${
                    COLOR_CONSTANTS.STATUS_DOTS.OFFLINE
                  } rounded-full animate-pulse`}
                ></div>
                <span
                  className={`${
                    HEADER_CONSTANTS.STAT_TEXT_SIZES[
                      isMobile ? 'MOBILE' : 'DESKTOP'
                    ]
                  } font-medium`}
                >
                  {dashboardStats.offline} Offline
                </span>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleDarkMode}
            className={`${
              HEADER_CONSTANTS.BUTTON_SIZES[isMobile ? 'MOBILE' : 'DESKTOP']
            }`}
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePanel}
            className={`${
              HEADER_CONSTANTS.BUTTON_SIZES[isMobile ? 'MOBILE' : 'DESKTOP']
            }`}
          >
            {isPanelOpen ? (
              <PanelRightClose
                className={`${
                  HEADER_CONSTANTS.ICON_SIZES_BUTTON[
                    isMobile ? 'MOBILE' : 'DESKTOP'
                  ]
                } ${!isMobile ? 'md:mr-2' : ''}`}
              />
            ) : (
              <PanelRight
                className={`${
                  HEADER_CONSTANTS.ICON_SIZES_BUTTON[
                    isMobile ? 'MOBILE' : 'DESKTOP'
                  ]
                } ${!isMobile ? 'md:mr-2' : ''}`}
              />
            )}
            <span className="hidden md:inline">Panel</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
