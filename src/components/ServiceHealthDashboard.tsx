import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeChange,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { mockServicesData } from '../data/mock';
import ServiceNode from './ServiceNode';
import EnvironmentNode from './EnvironmentNode';
import DetailsPanel from './DetailsPanel';
import CustomEdge from './CustomEdge';
import DashboardHeader from './DashboardHeader';
import { TooltipProvider } from './ui/tooltip';
import {
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS,
  NODE_TYPES,
  SERVICE_STATUS,
  ENVIRONMENT_IDS,
  SELECTED_ITEM_TYPES,
} from '../constants/dashboard';
import { isMobile, isTablet, getLayoutConstants } from '../utils/responsive';
import { useStatusUpdates } from '../hooks/useStatusUpdates';

const nodeTypes = {
  [NODE_TYPES.SERVICE]: ServiceNode,
  [NODE_TYPES.ENVIRONMENT]: EnvironmentNode,
};

// Custom edge type for React Flow compatibility
const edgeTypes = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom: CustomEdge as React.ComponentType<any>,
};

type ServiceData = {
  id: string;
  name: string;
  tech: string;
  version: string;
  status: (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];
  parent: string;
};

type ConnectionData = {
  id: string;
  source: string;
  target: string;
  status: (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];
};

type SelectedItem =
  | { type: typeof SELECTED_ITEM_TYPES.SERVICE; data: ServiceData }
  | { type: typeof SELECTED_ITEM_TYPES.CONNECTION; data: ConnectionData }
  | null;

const ServiceHealthDashboard = (): React.JSX.Element => {
  const [nodes, setNodes, onNodesChangeBase] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [isLocked] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  // Function to calculate dynamic container height based on services
  const calculateContainerHeight = useCallback(
    (serviceCount: number, windowWidth: number): number => {
      const layout = getLayoutConstants(windowWidth);

      // Calculate number of rows needed
      const rows = Math.ceil(serviceCount / layout.COLS_PER_ROW);

      // Calculate total height needed
      // First row: containerPadding + headerHeight + serviceHeight
      // Additional rows: (rows - 1) * (serviceHeight + padding)
      // Bottom padding: containerPadding
      const totalHeight =
        layout.CONTAINER_PADDING +
        layout.HEADER_HEIGHT +
        layout.SERVICE_HEIGHT +
        (rows - 1) * (layout.SERVICE_HEIGHT + layout.SPACING_BETWEEN_ROWS) +
        layout.CONTAINER_PADDING;

      const finalHeight = Math.max(totalHeight, layout.MIN_HEIGHT);

      return finalHeight;
    },
    []
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // If locked, prevent all position changes
      if (isLocked) {
        return;
      }

      const updatedChanges = changes.map((change) => {
        if (
          change.type === 'position' &&
          'position' in change &&
          'dragging' in change &&
          change.dragging
        ) {
          const node = nodes.find((n) => n.id === change.id);
          if (
            node &&
            node.type === NODE_TYPES.SERVICE &&
            'parentNode' in node &&
            node.parentNode
          ) {
            const mobile = isMobile(windowSize.width);
            const tablet = isTablet(windowSize.width);
            const layout = getLayoutConstants(windowSize.width);

            // Get service count for the parent environment
            const parentServices = nodes.filter(
              (n) =>
                n.type === NODE_TYPES.SERVICE &&
                'parentNode' in n &&
                n.parentNode === node.parentNode
            );
            const dynamicHeight = calculateContainerHeight(
              parentServices.length,
              windowSize.width
            );

            let containerWidth: number;

            if (mobile) {
              // Calculate container width with generous spacing to prevent overflow
              const spacing = 80; // Increased spacing between services
              const maxCol = layout.COLS_PER_ROW - 1; // For 2 columns, max column index is 1
              const maxServiceX =
                layout.CONTAINER_PADDING +
                maxCol * (layout.SERVICE_WIDTH + spacing);
              containerWidth =
                maxServiceX +
                layout.SERVICE_WIDTH +
                layout.CONTAINER_PADDING +
                50;
            } else if (tablet) {
              // Calculate container width with generous spacing to prevent overflow
              const spacing = 80; // Increased spacing between services
              const maxCol = layout.COLS_PER_ROW - 1; // For 2 columns, max column index is 1
              const maxServiceX =
                layout.CONTAINER_PADDING +
                maxCol * (layout.SERVICE_WIDTH + spacing);
              containerWidth =
                maxServiceX +
                layout.SERVICE_WIDTH +
                layout.CONTAINER_PADDING +
                50;
            } else {
              containerWidth = Math.min(
                windowSize.width - LAYOUT_CONSTANTS.DESKTOP.VIEWPORT_MARGIN,
                LAYOUT_CONSTANTS.DESKTOP.MAX_CONTAINER_WIDTH
              );
            }

            const minX = layout.CONTAINER_PADDING;
            const minY = layout.CONTAINER_PADDING + layout.HEADER_HEIGHT;
            const maxX =
              containerWidth - layout.SERVICE_WIDTH - layout.CONTAINER_PADDING;
            // Allow bottom row to reach its intended position by using a more generous maxY
            const maxY = dynamicHeight - layout.SERVICE_HEIGHT;

            if ('position' in change && change.position) {
              change.position.x = Math.max(
                minX,
                Math.min(maxX, change.position.x)
              );
              change.position.y = Math.max(
                minY,
                Math.min(maxY, change.position.y)
              );
            }
          }
        }
        return change;
      });

      onNodesChangeBase(updatedChanges);
    },
    [onNodesChangeBase, nodes, windowSize, isLocked, calculateContainerHeight]
  );

  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Get service and connection IDs for real-time data
  const serviceIds = nodes
    .filter((n) => n.type === NODE_TYPES.SERVICE)
    .map((n) => n.id);
  const connectionIds = edges.map((e) => e.id);

  // Use status updates hook
  const { data: statusData } = useStatusUpdates({
    serviceIds,
    connectionIds,
    config: {
      statusUpdateInterval: LAYOUT_CONSTANTS.INTERVALS.STATUS_UPDATE,
      statusChangeProbability:
        LAYOUT_CONSTANTS.INTERVALS.STATUS_CHANGE_PROBABILITY,
      connectionChangeProbability:
        LAYOUT_CONSTANTS.INTERVALS.EDGE_CHANGE_PROBABILITY,
    },
  });

  const initializeData = useCallback(() => {
    const serviceNodes = mockServicesData.nodes.filter(
      (node) => node.type === NODE_TYPES.SERVICE
    );
    const environmentNodes = mockServicesData.nodes.filter(
      (node) => node.type === NODE_TYPES.ENVIRONMENT
    );

    const mobile = isMobile(windowSize.width);
    const tablet = isTablet(windowSize.width);

    // Calculate dynamic heights for each environment
    const prodServicesList = serviceNodes.filter(
      (node) => node.parent === ENVIRONMENT_IDS.PROD
    );
    const stagingServicesList = serviceNodes.filter(
      (node) => node.parent === ENVIRONMENT_IDS.STAGING
    );

    const prodHeight = calculateContainerHeight(
      prodServicesList.length,
      windowSize.width
    );
    const stagingHeight = calculateContainerHeight(
      stagingServicesList.length,
      windowSize.width
    );

    let envPositions: Record<string, { x: number; y: number }>;
    if (mobile) {
      const centerX = LAYOUT_CONSTANTS.ENVIRONMENT_POSITIONS.MOBILE.CENTER_X;
      const topY = LAYOUT_CONSTANTS.ENVIRONMENT_POSITIONS.MOBILE.TOP_Y;
      envPositions = {
        [ENVIRONMENT_IDS.PROD]: { x: centerX, y: topY },
        [ENVIRONMENT_IDS.STAGING]: {
          x: centerX,
          y: topY + prodHeight + LAYOUT_CONSTANTS.ENVIRONMENT_GAPS.MOBILE,
        },
      };
    } else if (tablet) {
      const containerWidth =
        LAYOUT_CONSTANTS.ENVIRONMENT_POSITIONS.TABLET.CONTAINER_WIDTH;
      const centerX = (windowSize.width - containerWidth) / 2;
      const topY = LAYOUT_CONSTANTS.TABLET.CONTAINER_PADDING;
      envPositions = {
        [ENVIRONMENT_IDS.PROD]: { x: centerX, y: topY },
        [ENVIRONMENT_IDS.STAGING]: {
          x: centerX,
          y: topY + prodHeight + LAYOUT_CONSTANTS.ENVIRONMENT_GAPS.TABLET,
        },
      };
    } else {
      const containerWidth =
        LAYOUT_CONSTANTS.ENVIRONMENT_POSITIONS.DESKTOP.CONTAINER_WIDTH;
      const centerX = (windowSize.width - containerWidth) / 2;
      const topY = LAYOUT_CONSTANTS.ENVIRONMENT_POSITIONS.DESKTOP.TOP_Y;
      envPositions = {
        [ENVIRONMENT_IDS.PROD]: { x: centerX, y: topY },
        [ENVIRONMENT_IDS.STAGING]: {
          x: centerX,
          y: topY + prodHeight + LAYOUT_CONSTANTS.ENVIRONMENT_GAPS.DESKTOP,
        },
      };
    }

    const flowNodes: Node[] = [];

    environmentNodes.forEach((env) => {
      const dynamicHeight =
        env.id === ENVIRONMENT_IDS.PROD ? prodHeight : stagingHeight;

      flowNodes.push({
        id: env.id,
        type: NODE_TYPES.ENVIRONMENT,
        position: envPositions[env.id],
        data: {
          ...env,
          containerHeight: dynamicHeight,
          isMobile: mobile,
          isTablet: tablet,
          windowWidth: windowSize.width,
        },
        draggable: false,
      } as unknown as Node);
    });

    prodServicesList.forEach((service, index: number) => {
      const layout = getLayoutConstants(windowSize.width);

      const row = Math.floor(index / layout.COLS_PER_ROW);
      const col = index % layout.COLS_PER_ROW;

      let containerWidth: number;

      if (mobile) {
        containerWidth =
          layout.CONTAINER_WIDTH_MULTIPLIER * layout.SERVICE_WIDTH +
          layout.CONTAINER_WIDTH_SPACING +
          layout.CONTAINER_WIDTH_PADDING;
      } else if (tablet) {
        // Calculate container width based on service count and spacing
        const spacing = 50; // Minimum spacing between services
        const maxCol = layout.COLS_PER_ROW - 1;
        const maxServiceX =
          layout.CONTAINER_PADDING + maxCol * (layout.SERVICE_WIDTH + spacing);
        containerWidth =
          maxServiceX + layout.SERVICE_WIDTH + layout.CONTAINER_PADDING;
      } else {
        containerWidth = Math.min(
          windowSize.width - LAYOUT_CONSTANTS.DESKTOP.VIEWPORT_MARGIN,
          LAYOUT_CONSTANTS.DESKTOP.MAX_CONTAINER_WIDTH
        );
      }

      // Calculate consistent spacing
      const availableWidth = containerWidth - 2 * layout.CONTAINER_PADDING;
      const totalServiceWidth = layout.COLS_PER_ROW * layout.SERVICE_WIDTH;
      const remainingSpace = availableWidth - totalServiceWidth;

      const spacingBetweenServices = mobile
        ? Math.max(
            layout.SPACING_BETWEEN_SERVICES,
            layout.COLS_PER_ROW > 1
              ? remainingSpace / (layout.COLS_PER_ROW - 1)
              : 0
          )
        : tablet
        ? Math.max(
            layout.SPACING_BETWEEN_SERVICES,
            layout.COLS_PER_ROW > 1
              ? remainingSpace / (layout.COLS_PER_ROW - 1)
              : 0
          )
        : layout.COLS_PER_ROW > 1
        ? remainingSpace / (layout.COLS_PER_ROW - 1)
        : 0;

      // Calculate position with consistent margins
      const x =
        layout.CONTAINER_PADDING +
        col * (layout.SERVICE_WIDTH + spacingBetweenServices);
      const y =
        layout.CONTAINER_PADDING +
        layout.HEADER_HEIGHT +
        row * (layout.SERVICE_HEIGHT + layout.SPACING_BETWEEN_ROWS);

      flowNodes.push({
        id: service.id,
        type: NODE_TYPES.SERVICE,
        position: { x, y },
        data: { ...service },
        parentNode: service.parent,
        extent: 'parent',
        draggable: true,
        zIndex: 10,
      } as unknown as Node);
    });

    stagingServicesList.forEach((service, index: number) => {
      const layout = getLayoutConstants(windowSize.width);

      let containerWidth: number;

      if (mobile) {
        containerWidth =
          layout.CONTAINER_WIDTH_MULTIPLIER * layout.SERVICE_WIDTH +
          layout.CONTAINER_WIDTH_SPACING +
          layout.CONTAINER_WIDTH_PADDING;
      } else if (tablet) {
        containerWidth =
          layout.CONTAINER_WIDTH_MULTIPLIER * layout.SERVICE_WIDTH +
          layout.CONTAINER_WIDTH_SPACING +
          layout.CONTAINER_WIDTH_PADDING;
      } else {
        containerWidth = Math.min(
          windowSize.width - LAYOUT_CONSTANTS.DESKTOP.VIEWPORT_MARGIN,
          LAYOUT_CONSTANTS.DESKTOP.MAX_CONTAINER_WIDTH
        );
      }

      // Calculate consistent spacing for staging services (single row)
      const availableWidth = containerWidth - 2 * layout.CONTAINER_PADDING;
      const totalServiceWidth =
        stagingServicesList.length * layout.SERVICE_WIDTH;
      const remainingSpace = availableWidth - totalServiceWidth;
      const spacingBetweenServices = mobile
        ? Math.max(
            layout.SPACING_BETWEEN_SERVICES,
            stagingServicesList.length > 1
              ? remainingSpace / (stagingServicesList.length - 1)
              : 0
          )
        : tablet
        ? Math.max(
            layout.SPACING_BETWEEN_SERVICES,
            stagingServicesList.length > 1
              ? remainingSpace / (stagingServicesList.length - 1)
              : 0
          )
        : stagingServicesList.length > 1
        ? remainingSpace / (stagingServicesList.length - 1)
        : 0;

      // Calculate position with consistent margins
      const x =
        layout.CONTAINER_PADDING +
        index * (layout.SERVICE_WIDTH + spacingBetweenServices);
      const y = layout.CONTAINER_PADDING + layout.HEADER_HEIGHT;

      flowNodes.push({
        id: service.id,
        type: NODE_TYPES.SERVICE,
        position: { x, y },
        data: { ...service },
        parentNode: service.parent,
        extent: 'parent',
        draggable: true,
        zIndex: 10,
      } as unknown as Node);
    });

    const flowEdges: Edge[] = mockServicesData.connections.map((conn) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: 'custom',
      data: { ...conn },
      animated: conn.status === SERVICE_STATUS.HEALTHY,
      style: {
        stroke:
          conn.status === SERVICE_STATUS.HEALTHY
            ? COLOR_CONSTANTS.STATUS.HEALTHY
            : conn.status === SERVICE_STATUS.DEGRADED
            ? COLOR_CONSTANTS.STATUS.DEGRADED
            : COLOR_CONSTANTS.STATUS.OFFLINE,
        strokeWidth: LAYOUT_CONSTANTS.REACT_FLOW.EDGE_STROKE_WIDTH,
        strokeOpacity: LAYOUT_CONSTANTS.REACT_FLOW.EDGE_STROKE_OPACITY,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color:
          conn.status === SERVICE_STATUS.HEALTHY
            ? COLOR_CONSTANTS.STATUS.HEALTHY
            : conn.status === SERVICE_STATUS.DEGRADED
            ? COLOR_CONSTANTS.STATUS.DEGRADED
            : COLOR_CONSTANTS.STATUS.OFFLINE,
      },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [setNodes, setEdges, windowSize, calculateContainerHeight]);

  const clearSelection = () => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));
    setEdges((eds) => eds.map((e) => ({ ...e, selected: false })));
  };

  // Update nodes with status changes
  useEffect(() => {
    if (Object.keys(statusData.serviceStatuses).length > 0) {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (
            node.type === NODE_TYPES.SERVICE &&
            statusData.serviceStatuses[node.id]
          ) {
            return {
              ...node,
              data: {
                ...node.data,
                status: statusData.serviceStatuses[node.id],
              },
            };
          }
          return node;
        })
      );
    }
  }, [statusData.serviceStatuses, setNodes]);

  // Update edges with status changes
  useEffect(() => {
    if (Object.keys(statusData.connectionStatuses).length > 0) {
      setEdges((prevEdges) =>
        prevEdges.map((edge) => {
          if (statusData.connectionStatuses[edge.id]) {
            const newStatus = statusData.connectionStatuses[edge.id];
            return {
              ...edge,
              data: { ...edge.data, status: newStatus },
              animated: newStatus === SERVICE_STATUS.HEALTHY,
              style: {
                stroke:
                  newStatus === SERVICE_STATUS.HEALTHY
                    ? COLOR_CONSTANTS.STATUS.HEALTHY
                    : newStatus === SERVICE_STATUS.DEGRADED
                    ? COLOR_CONSTANTS.STATUS.DEGRADED
                    : COLOR_CONSTANTS.STATUS.OFFLINE,
                strokeWidth: LAYOUT_CONSTANTS.REACT_FLOW.EDGE_STROKE_WIDTH,
                strokeOpacity: LAYOUT_CONSTANTS.REACT_FLOW.EDGE_STROKE_OPACITY,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color:
                  newStatus === SERVICE_STATUS.HEALTHY
                    ? COLOR_CONSTANTS.STATUS.HEALTHY
                    : newStatus === SERVICE_STATUS.DEGRADED
                    ? COLOR_CONSTANTS.STATUS.DEGRADED
                    : COLOR_CONSTANTS.STATUS.OFFLINE,
              },
            } as Edge;
          }
          return edge;
        })
      );
    }
  }, [statusData.connectionStatuses, setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (node.type === NODE_TYPES.SERVICE) {
      setSelectedItem({ type: SELECTED_ITEM_TYPES.SERVICE, data: node.data });
      setIsPanelOpen(true);
    }
  }, []);

  const onEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
    setSelectedItem({ type: SELECTED_ITEM_TYPES.CONNECTION, data: edge.data });
    setIsPanelOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedItem(null);
    setIsPanelOpen(false);
  }, []);

  const onNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === NODE_TYPES.SERVICE && node.parentNode) {
        const parentNode = nodes.find((n) => n.id === node.parentNode);
        if (parentNode) {
          const mobile = isMobile(windowSize.width);
          const tablet = isTablet(windowSize.width);
          const layout = getLayoutConstants(windowSize.width);

          // Get service count for the parent environment
          const parentServices = nodes.filter(
            (n) =>
              n.type === NODE_TYPES.SERVICE && n.parentNode === node.parentNode
          );
          const dynamicHeight = calculateContainerHeight(
            parentServices.length,
            windowSize.width
          );

          let containerWidth: number;

          if (mobile) {
            containerWidth = windowSize.width; // Full viewport width
          } else if (tablet) {
            containerWidth = Math.min(windowSize.width - 100, 800);
          } else {
            containerWidth = Math.min(
              windowSize.width - LAYOUT_CONSTANTS.DESKTOP.VIEWPORT_MARGIN,
              LAYOUT_CONSTANTS.DESKTOP.MAX_CONTAINER_WIDTH
            );
          }

          const minX = layout.CONTAINER_PADDING;
          const minY = layout.CONTAINER_PADDING + layout.HEADER_HEIGHT;
          const maxX =
            containerWidth - layout.SERVICE_WIDTH - layout.CONTAINER_PADDING;
          // Allow bottom row to reach its intended position by using a more generous maxY
          const maxY = dynamicHeight - layout.SERVICE_HEIGHT;

          if (node.position.x < minX) node.position.x = minX;
          if (node.position.y < minY) node.position.y = minY;
          if (node.position.x > maxX) node.position.x = maxX;
          if (node.position.y > maxY) node.position.y = maxY;
        }
      }
    },
    [nodes, windowSize, calculateContainerHeight]
  );

  const dashboardStats = useMemo(() => {
    const serviceNodes = nodes.filter((n) => n.type === NODE_TYPES.SERVICE);
    const healthy = serviceNodes.filter(
      (n) =>
        n.data && 'status' in n.data && n.data.status === SERVICE_STATUS.HEALTHY
    ).length;
    const degraded = serviceNodes.filter(
      (n) =>
        n.data &&
        'status' in n.data &&
        n.data.status === SERVICE_STATUS.DEGRADED
    ).length;
    const offline = serviceNodes.filter(
      (n) =>
        n.data && 'status' in n.data && n.data.status === SERVICE_STATUS.OFFLINE
    ).length;

    return { total: serviceNodes.length, healthy, degraded, offline };
  }, [nodes]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <TooltipProvider>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="h-screen flex flex-col bg-background text-foreground">
          {/* Header */}
          <DashboardHeader
            windowSize={windowSize}
            dashboardStats={dashboardStats}
            isDarkMode={isDarkMode}
            isPanelOpen={isPanelOpen}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            <div
              className={`flex-1 relative min-h-0 ${
                windowSize.width < 768 ? 'p-0 overflow-x-auto' : 'p-4'
              }`}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeDrag={onNodeDrag}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView={false}
                className={`${isDarkMode ? 'dark-theme' : ''} ${
                  windowSize.width < 768 ? '' : 'rounded-lg border'
                } w-full h-full`}
                defaultViewport={{
                  x: 0,
                  y: 0,
                  zoom: LAYOUT_CONSTANTS.REACT_FLOW.DEFAULT_ZOOM,
                }}
                snapToGrid={false}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
              >
                <Background
                  gap={LAYOUT_CONSTANTS.REACT_FLOW.BACKGROUND_GAP}
                  size={LAYOUT_CONSTANTS.REACT_FLOW.BACKGROUND_SIZE}
                />
              </ReactFlow>
            </div>

            {/* Details Panel */}
            {isPanelOpen && (
              <DetailsPanel
                selectedItem={selectedItem}
                onClose={() => {
                  setIsPanelOpen(false);
                  setSelectedItem(null);
                  clearSelection();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ServiceHealthDashboard;
