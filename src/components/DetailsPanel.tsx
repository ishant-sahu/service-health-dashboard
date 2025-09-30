import React, { useEffect } from 'react';
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
import { RealTimeChart } from './charts';
import { useConnectionMetrics } from '../hooks/useConnectionMetrics';
import { usePanelFocusManagement } from '../hooks/useFocusManagement';
import { useScreenReaderAnnouncements } from '../hooks/useScreenReaderAnnouncements';
import {
  SERVICE_STATUS,
  COLOR_CONSTANTS,
  ENVIRONMENT_IDS,
  ENVIRONMENT_NAMES,
  DETAILS_PANEL_CONSTANTS,
  SELECTED_ITEM_TYPES,
} from '../constants/dashboard';
import { isMobile } from '../utils/responsive';

type ServiceItem = {
  type: typeof SELECTED_ITEM_TYPES.SERVICE;
  data: {
    name: string;
    tech: string;
    version: string;
    status: (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];
    parent: string;
  };
};

type ConnectionItem = {
  type: typeof SELECTED_ITEM_TYPES.CONNECTION;
  data: {
    id: string;
    source: string;
    target: string;
    status: (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];
  };
};

type SelectedItem = ServiceItem | ConnectionItem | null;

export default function DetailsPanel({
  selectedItem,
  onClose,
}: {
  selectedItem: SelectedItem;
  onClose: () => void;
}): React.JSX.Element {
  // Use connection metrics hook - only fetch when a connection is selected
  const { metrics: connectionMetrics, cachedData } = useConnectionMetrics({
    connectionId:
      selectedItem?.type === SELECTED_ITEM_TYPES.CONNECTION
        ? selectedItem.data.id
        : undefined,
    enabled: selectedItem?.type === SELECTED_ITEM_TYPES.CONNECTION,
  });

  // Use focus management for the panel
  const { panelRef } = usePanelFocusManagement(!!selectedItem);

  // Use screen reader announcements
  const { announceMetricsUpdate } = useScreenReaderAnnouncements();

  const isMobileDevice =
    typeof window !== 'undefined' && isMobile(window.innerWidth);

  // Handle escape key to close panel
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedItem) {
        onClose();
      }
    };

    if (selectedItem) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedItem, onClose]);

  // Announce metrics updates for connections
  useEffect(() => {
    if (
      selectedItem?.type === SELECTED_ITEM_TYPES.CONNECTION &&
      connectionMetrics.rps !== undefined &&
      connectionMetrics.latency !== undefined &&
      connectionMetrics.errorRate !== undefined
    ) {
      announceMetricsUpdate(
        connectionMetrics.rps,
        connectionMetrics.latency,
        connectionMetrics.errorRate
      );
    }
  }, [selectedItem, connectionMetrics, announceMetricsUpdate]);

  if (!selectedItem) {
    return (
      <Card
        className={`${DETAILS_PANEL_CONSTANTS.DIMENSIONS.DESKTOP_WIDTH} ${DETAILS_PANEL_CONSTANTS.DIMENSIONS.HEIGHT} border-l bg-card/95 backdrop-blur`}
      >
        <div
          className={`${DETAILS_PANEL_CONSTANTS.SPACING.DESKTOP_PADDING} text-center text-muted-foreground`}
        >
          <Activity
            className={`${DETAILS_PANEL_CONSTANTS.ICON_SIZES.PLACEHOLDER} mx-auto mb-4 opacity-50`}
          />
          <p>{DETAILS_PANEL_CONSTANTS.TEXTS.SELECT_PLACEHOLDER}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      ref={panelRef}
      className={`${
        isMobileDevice
          ? `${DETAILS_PANEL_CONSTANTS.DIMENSIONS.MOBILE_WIDTH} ${DETAILS_PANEL_CONSTANTS.DIMENSIONS.HEIGHT} fixed top-0 right-0 z-50`
          : `${DETAILS_PANEL_CONSTANTS.DIMENSIONS.DESKTOP_WIDTH} ${DETAILS_PANEL_CONSTANTS.DIMENSIONS.HEIGHT} border-l`
      } bg-card/95 backdrop-blur overflow-y-auto focus:outline-none`}
      role="complementary"
      aria-label="Service details panel"
      tabIndex={-1}
    >
      <div
        className={`${
          isMobileDevice
            ? DETAILS_PANEL_CONSTANTS.SPACING.MOBILE_PADDING
            : DETAILS_PANEL_CONSTANTS.SPACING.DESKTOP_PADDING
        } border-b flex items-center justify-between`}
      >
        <h2
          className={`${
            isMobileDevice
              ? DETAILS_PANEL_CONSTANTS.TEXT_SIZES.MOBILE_TITLE
              : DETAILS_PANEL_CONSTANTS.TEXT_SIZES.DESKTOP_TITLE
          } font-semibold`}
          id="details-panel-title"
        >
          {DETAILS_PANEL_CONSTANTS.TEXTS.TITLE}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close details panel"
        >
          <X
            className={DETAILS_PANEL_CONSTANTS.ICON_SIZES.CLOSE}
            aria-hidden="true"
          />
        </Button>
      </div>

      <div
        className={`${
          isMobileDevice
            ? `${DETAILS_PANEL_CONSTANTS.SPACING.MOBILE_PADDING} ${DETAILS_PANEL_CONSTANTS.SPACING.MOBILE_SPACE}`
            : `${DETAILS_PANEL_CONSTANTS.SPACING.DESKTOP_PADDING} ${DETAILS_PANEL_CONSTANTS.SPACING.DESKTOP_SPACE}`
        }`}
      >
        {selectedItem.type === SELECTED_ITEM_TYPES.SERVICE && (
          <div role="region" aria-labelledby="service-details-heading">
            <div className="flex items-center gap-2 mb-4">
              <Server
                className={`${DETAILS_PANEL_CONSTANTS.ICON_SIZES.SECTION} text-primary`}
                aria-hidden="true"
              />
              <h3
                className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.SECTION_TITLE} font-semibold`}
                id="service-details-heading"
              >
                {DETAILS_PANEL_CONSTANTS.TEXTS.SERVICE_DETAILS}
              </h3>
            </div>

            <dl className="space-y-3">
              <div>
                <dt
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.LABEL} font-medium text-muted-foreground`}
                >
                  {DETAILS_PANEL_CONSTANTS.TEXTS.NAME}
                </dt>
                <dd
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.VALUE} font-medium`}
                >
                  {selectedItem.data.name}
                </dd>
              </div>

              <div>
                <dt
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.LABEL} font-medium text-muted-foreground`}
                >
                  {DETAILS_PANEL_CONSTANTS.TEXTS.TYPE}
                </dt>
                <dd>
                  <Badge
                    variant="outline"
                    className="ml-2"
                    aria-label={`Technology: ${selectedItem.data.tech}`}
                  >
                    {selectedItem.data.tech}
                  </Badge>
                </dd>
              </div>

              <div>
                <dt
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.LABEL} font-medium text-muted-foreground`}
                >
                  {DETAILS_PANEL_CONSTANTS.TEXTS.VERSION}
                </dt>
                <dd className={DETAILS_PANEL_CONSTANTS.TEXT_SIZES.VALUE}>
                  {selectedItem.data.version}
                </dd>
              </div>

              <div>
                <dt
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.LABEL} font-medium text-muted-foreground`}
                >
                  {DETAILS_PANEL_CONSTANTS.TEXTS.STATUS}
                </dt>
                <dd>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`${
                        DETAILS_PANEL_CONSTANTS.STATUS_DOT
                      } rounded-full ${
                        selectedItem.data.status === SERVICE_STATUS.HEALTHY
                          ? COLOR_CONSTANTS.STATUS_DOTS.HEALTHY
                          : selectedItem.data.status === SERVICE_STATUS.DEGRADED
                          ? COLOR_CONSTANTS.STATUS_DOTS.DEGRADED
                          : COLOR_CONSTANTS.STATUS_DOTS.OFFLINE
                      }`}
                      aria-hidden="true"
                    />
                    <Badge
                      variant={
                        selectedItem.data.status === SERVICE_STATUS.HEALTHY
                          ? 'default'
                          : 'destructive'
                      }
                      aria-label={`Service status: ${selectedItem.data.status}`}
                    >
                      {selectedItem.data.status}
                    </Badge>
                  </div>
                </dd>
              </div>

              <div>
                <dt
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.LABEL} font-medium text-muted-foreground`}
                >
                  {DETAILS_PANEL_CONSTANTS.TEXTS.ENVIRONMENT}
                </dt>
                <dd className={DETAILS_PANEL_CONSTANTS.TEXT_SIZES.VALUE}>
                  {selectedItem.data.parent === ENVIRONMENT_IDS.PROD
                    ? ENVIRONMENT_NAMES.PROD
                    : ENVIRONMENT_NAMES.STAGING}
                </dd>
              </div>
            </dl>
          </div>
        )}

        {selectedItem.type === SELECTED_ITEM_TYPES.CONNECTION && (
          <div role="region" aria-labelledby="connection-details-heading">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight
                className={`${DETAILS_PANEL_CONSTANTS.ICON_SIZES.SECTION} text-primary`}
                aria-hidden="true"
              />
              <h3
                className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.SECTION_TITLE} font-semibold`}
                id="connection-details-heading"
              >
                {DETAILS_PANEL_CONSTANTS.TEXTS.CONNECTION_DETAILS}
              </h3>
            </div>

            <dl className="space-y-3 mb-6">
              <div>
                <dt
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.LABEL} font-medium text-muted-foreground`}
                >
                  {DETAILS_PANEL_CONSTANTS.TEXTS.SOURCE_SERVICE}
                </dt>
                <dd
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.VALUE} font-medium`}
                >
                  {selectedItem.data.source}
                </dd>
              </div>

              <div>
                <dt
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.LABEL} font-medium text-muted-foreground`}
                >
                  {DETAILS_PANEL_CONSTANTS.TEXTS.TARGET_SERVICE}
                </dt>
                <dd
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.VALUE} font-medium`}
                >
                  {selectedItem.data.target}
                </dd>
              </div>

              <div>
                <dt
                  className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.LABEL} font-medium text-muted-foreground`}
                >
                  {DETAILS_PANEL_CONSTANTS.TEXTS.CONNECTION_STATUS}
                </dt>
                <dd>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`${
                        DETAILS_PANEL_CONSTANTS.STATUS_DOT
                      } rounded-full ${
                        selectedItem.data.status === SERVICE_STATUS.HEALTHY
                          ? COLOR_CONSTANTS.STATUS_DOTS.HEALTHY
                          : selectedItem.data.status === SERVICE_STATUS.DEGRADED
                          ? COLOR_CONSTANTS.STATUS_DOTS.DEGRADED
                          : COLOR_CONSTANTS.STATUS_DOTS.OFFLINE
                      }`}
                      aria-hidden="true"
                    />
                    <Badge
                      variant={
                        selectedItem.data.status === SERVICE_STATUS.HEALTHY
                          ? 'default'
                          : 'destructive'
                      }
                      aria-label={`Connection status: ${selectedItem.data.status}`}
                    >
                      {selectedItem.data.status}
                    </Badge>
                  </div>
                </dd>
              </div>
            </dl>

            <Separator />

            <div
              className="mt-6"
              role="region"
              aria-labelledby="metrics-heading"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap
                  className={`${DETAILS_PANEL_CONSTANTS.ICON_SIZES.METRICS_HEADER} text-primary`}
                  aria-hidden="true"
                />
                <h4 className="font-semibold" id="metrics-heading">
                  {DETAILS_PANEL_CONSTANTS.TEXTS.REAL_TIME_METRICS}
                </h4>
                <div
                  className={`${DETAILS_PANEL_CONSTANTS.STATUS_DOT} ${COLOR_CONSTANTS.STATUS_DOTS.HEALTHY} rounded-full ${DETAILS_PANEL_CONSTANTS.ANIMATION.PULSE}`}
                  aria-hidden="true"
                />
              </div>

              {/* Current Metrics Cards */}
              <div
                className={`grid ${DETAILS_PANEL_CONSTANTS.GRID.METRICS} gap-2 mb-4`}
                role="group"
                aria-label="Connection metrics"
              >
                <Card
                  className="p-2 text-center"
                  role="status"
                  aria-label={`Requests per second: ${
                    connectionMetrics.rps || 0
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp
                      className={`${DETAILS_PANEL_CONSTANTS.ICON_SIZES.METRIC} text-blue-500`}
                      aria-hidden="true"
                    />
                    <span
                      className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.METRIC_LABEL} font-medium`}
                    >
                      {DETAILS_PANEL_CONSTANTS.TEXTS.RPS}
                    </span>
                  </div>
                  <span
                    className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.METRIC_VALUE} font-bold text-blue-500`}
                  >
                    {connectionMetrics.rps || 0}
                  </span>
                </Card>

                <Card
                  className="p-2 text-center"
                  role="status"
                  aria-label={`Response latency: ${
                    connectionMetrics.latency || 0
                  } milliseconds`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock
                      className={`${DETAILS_PANEL_CONSTANTS.ICON_SIZES.METRIC} text-green-500`}
                      aria-hidden="true"
                    />
                    <span
                      className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.METRIC_LABEL} font-medium`}
                    >
                      {DETAILS_PANEL_CONSTANTS.TEXTS.LATENCY}
                    </span>
                  </div>
                  <span
                    className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.METRIC_VALUE} font-bold text-green-500`}
                  >
                    {connectionMetrics.latency || 0}ms
                  </span>
                </Card>

                <Card
                  className="p-2 text-center"
                  role="status"
                  aria-label={`Error rate: ${(
                    connectionMetrics.errorRate || 0
                  ).toFixed(2)} percent`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertTriangle
                      className={`${DETAILS_PANEL_CONSTANTS.ICON_SIZES.METRIC} text-amber-500`}
                      aria-hidden="true"
                    />
                    <span
                      className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.METRIC_LABEL} font-medium`}
                    >
                      {DETAILS_PANEL_CONSTANTS.TEXTS.ERRORS}
                    </span>
                  </div>
                  <span
                    className={`${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.METRIC_VALUE} font-bold text-amber-500`}
                  >
                    {(connectionMetrics.errorRate || 0).toFixed(2)}%
                  </span>
                </Card>
              </div>

              {/* Real-time Charts */}
              {cachedData.length > 0 && (
                <div className="space-y-4">
                  <RealTimeChart
                    data={cachedData}
                    dataKey="rps"
                    color={DETAILS_PANEL_CONSTANTS.CHART_COLORS.RPS}
                    type="area"
                    title={DETAILS_PANEL_CONSTANTS.TEXTS.REQUESTS_PER_SECOND}
                    height={DETAILS_PANEL_CONSTANTS.CHART_HEIGHT}
                  />

                  <RealTimeChart
                    data={cachedData}
                    dataKey="latency"
                    color={DETAILS_PANEL_CONSTANTS.CHART_COLORS.LATENCY}
                    type="line"
                    title={DETAILS_PANEL_CONSTANTS.TEXTS.RESPONSE_LATENCY}
                    height={DETAILS_PANEL_CONSTANTS.CHART_HEIGHT}
                  />

                  <RealTimeChart
                    data={cachedData}
                    dataKey="errorRate"
                    color={DETAILS_PANEL_CONSTANTS.CHART_COLORS.ERROR_RATE}
                    type="area"
                    title={DETAILS_PANEL_CONSTANTS.TEXTS.ERROR_RATE}
                    height={DETAILS_PANEL_CONSTANTS.CHART_HEIGHT}
                  />
                </div>
              )}

              <div
                className={`mt-4 ${DETAILS_PANEL_CONSTANTS.TEXT_SIZES.FOOTER} text-muted-foreground text-center`}
              >
                {cachedData.length > 0
                  ? `${DETAILS_PANEL_CONSTANTS.TEXTS.SHOWING_DATA} ${cachedData.length} ${DETAILS_PANEL_CONSTANTS.TEXTS.DATA_POINTS}`
                  : DETAILS_PANEL_CONSTANTS.TEXTS.WAITING_DATA}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
