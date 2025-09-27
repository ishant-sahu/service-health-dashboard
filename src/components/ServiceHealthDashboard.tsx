import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  NodeChange,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import {
  mockServicesData,
  generateMetrics,
  getRandomStatus,
} from '../data/mock';
import ServiceNode from './ServiceNode';
import EnvironmentNode from './EnvironmentNode';
import DetailsPanel from './DetailsPanel';
import CustomEdge from './CustomEdge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { TooltipProvider } from './ui/tooltip';
import {
  PanelRightClose,
  PanelRight,
  Activity,
  Zap,
  AlertCircle,
} from 'lucide-react';

const nodeTypes = {
  service: ServiceNode as any,
  environment: EnvironmentNode as any,
};

const edgeTypes = {
  custom: CustomEdge as any,
};

type SelectedItem =
  | { type: 'service'; data: any }
  | { type: 'connection'; data: any }
  | null;

const ServiceHealthDashboard = (): React.JSX.Element => {
  const [nodes, setNodes, onNodesChangeBase] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  // Function to calculate dynamic container height based on services
  const calculateContainerHeight = useCallback(
    (
      serviceCount: number,
      isMobile: boolean,
      isTablet: boolean,
      environmentId: string
    ): number => {
      let containerPadding: number,
        headerHeight: number,
        serviceHeight: number,
        rowSpacing: number,
        colsPerRow: number;

      if (isMobile) {
        containerPadding = 20;
        headerHeight = 60;
        serviceHeight = 140;
        rowSpacing = serviceHeight + 20; // service height + padding
        colsPerRow = 2;
      } else if (isTablet) {
        containerPadding = 30;
        headerHeight = 70;
        serviceHeight = 150;
        rowSpacing = serviceHeight + 30; // service height + padding
        colsPerRow = 2;
      } else {
        containerPadding = 40;
        headerHeight = 80;
        serviceHeight = 160;
        rowSpacing = serviceHeight + 40; // service height + padding
        colsPerRow = 3;
      }

      // Calculate number of rows needed
      const rows = Math.ceil(serviceCount / colsPerRow);

      // Calculate total height needed
      // First row: containerPadding + headerHeight + serviceHeight
      // Additional rows: (rows - 1) * (serviceHeight + padding)
      // Bottom padding: containerPadding
      const paddingBetweenRows = isMobile ? 20 : isTablet ? 30 : 40;
      const totalHeight =
        containerPadding +
        headerHeight +
        serviceHeight +
        (rows - 1) * (serviceHeight + paddingBetweenRows) +
        containerPadding;

      // Add minimum height buffer to ensure services don't feel cramped
      const minHeight = isMobile ? 200 : isTablet ? 250 : 300;

      const finalHeight = Math.max(totalHeight, minHeight);

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
          (change as any).type === 'position' &&
          (change as any).position &&
          (change as any).dragging
        ) {
          const node = nodes.find((n) => n.id === (change as any).id);
          if (node && node.type === 'service' && (node as any).parentNode) {
            const isMobile = windowSize.width < 768;
            const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

            let containerPadding: number,
              headerHeight: number,
              serviceWidth: number,
              serviceHeight: number,
              containerWidth: number,
              containerHeight: number;

            // Get service count for the parent environment
            const parentServices = nodes.filter(
              (n: any) =>
                n.type === 'service' &&
                n.parentNode === (node as any).parentNode
            );
            const dynamicHeight = calculateContainerHeight(
              parentServices.length,
              isMobile,
              isTablet,
              (node as any).parentNode
            );

            if (isMobile) {
              containerPadding = 20;
              headerHeight = 60;
              serviceWidth = 180; // Fixed width for mobile services
              serviceHeight = 140;
              // Calculate container width with generous spacing to prevent overflow
              const spacing = 80; // Increased spacing between services
              const maxCol = 1; // For 2 columns, max column index is 1
              const maxServiceX =
                containerPadding + maxCol * (serviceWidth + spacing); // containerPadding + maxCol * (serviceWidth + spacing)
              containerWidth =
                maxServiceX + serviceWidth + containerPadding + 50; // maxX + serviceWidth + rightPadding + extra margin
              containerHeight = dynamicHeight;
            } else if (isTablet) {
              containerPadding = 30;
              headerHeight = 70;
              serviceWidth = 200;
              serviceHeight = 150;
              // Calculate container width with generous spacing to prevent overflow
              const spacing = 80; // Increased spacing between services
              const maxCol = 1; // For 2 columns, max column index is 1
              const maxServiceX =
                containerPadding + maxCol * (serviceWidth + spacing); // containerPadding + maxCol * (serviceWidth + spacing)
              containerWidth =
                maxServiceX + serviceWidth + containerPadding + 50; // maxX + serviceWidth + rightPadding + extra margin
              containerHeight = dynamicHeight;
            } else {
              containerPadding = 40;
              headerHeight = 80;
              serviceWidth = 240;
              serviceHeight = 160;
              containerWidth = Math.min(windowSize.width - 200, 1200);
              containerHeight = dynamicHeight;
            }

            const minX = containerPadding;
            const minY = containerPadding + headerHeight;
            const maxX = containerWidth - serviceWidth - containerPadding;
            // Allow bottom row to reach its intended position by using a more generous maxY
            const maxY = containerHeight - serviceHeight;

            (change as any).position.x = Math.max(
              minX,
              Math.min(maxX, (change as any).position.x)
            );
            (change as any).position.y = Math.max(
              minY,
              Math.min(maxY, (change as any).position.y)
            );
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
  const [realTimeMetrics, setRealTimeMetrics] = useState<Record<string, any>>(
    {}
  );
  const [isDarkMode, setIsDarkMode] = useState(true);

  const initializeData = useCallback(() => {
    const serviceNodes = mockServicesData.nodes.filter(
      (node: any) => node.type === 'service'
    );
    const environmentNodes = mockServicesData.nodes.filter(
      (node: any) => node.type === 'environment'
    );

    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

    // Calculate dynamic heights for each environment
    const prodServicesList = serviceNodes.filter(
      (node: any) => node.parent === 'prod-env'
    );
    const stagingServicesList = serviceNodes.filter(
      (node: any) => node.parent === 'staging-env'
    );

    const prodHeight = calculateContainerHeight(
      prodServicesList.length,
      isMobile,
      isTablet,
      'prod-env'
    );
    const stagingHeight = calculateContainerHeight(
      stagingServicesList.length,
      isMobile,
      isTablet,
      'staging-env'
    );

    let envPositions: Record<string, { x: number; y: number }>;
    if (isMobile) {
      // Calculate container width needed for two columns with increased spacing
      const serviceWidth = 180; // Fixed width for mobile services
      const containerWidth = 2 * serviceWidth + 40 + 40; // Two services + 40px spacing + 40px padding
      const centerX = 20; // 20px margin from left edge
      envPositions = {
        'prod-env': { x: centerX, y: 20 },
        'staging-env': { x: centerX, y: 20 + prodHeight + 20 }, // 20px gap between environments
      };
    } else if (isTablet) {
      // Center containers horizontally for tablet
      const tabletContainerWidth = 590; // Calculated container width for tablet
      const centerX = (windowSize.width - tabletContainerWidth) / 2;
      envPositions = {
        'prod-env': { x: centerX, y: 30 },
        'staging-env': { x: centerX, y: 30 + prodHeight + 30 }, // 30px gap between environments
      };
    } else {
      // Center containers horizontally for desktop
      const desktopContainerWidth = 1200; // Desktop container width
      const centerX = (windowSize.width - desktopContainerWidth) / 2;
      envPositions = {
        'prod-env': { x: centerX, y: 50 },
        'staging-env': { x: centerX, y: 50 + prodHeight + 50 }, // 50px gap between environments
      };
    }

    const flowNodes: Node[] = [];

    environmentNodes.forEach((env: any) => {
      const dynamicHeight = env.id === 'prod-env' ? prodHeight : stagingHeight;

      flowNodes.push({
        id: env.id,
        type: 'environment',
        position: envPositions[env.id],
        data: {
          ...env,
          containerHeight: dynamicHeight,
          isMobile,
          isTablet,
          windowWidth: windowSize.width,
        },
        draggable: false,
      } as unknown as Node);
    });

    prodServicesList.forEach((service: any, index: number) => {
      let row: number,
        col: number,
        serviceWidth: number,
        serviceHeight: number,
        containerPadding: number,
        headerHeight: number,
        rowSpacing: number,
        containerWidth: number,
        containerHeight: number,
        colsPerRow: number;

      if (isMobile) {
        row = Math.floor(index / 2);
        col = index % 2;
        serviceWidth = 180; // Fixed width for mobile services
        containerPadding = 20;
        headerHeight = 60;
        serviceHeight = 140;
        rowSpacing = serviceHeight + 20; // service height + padding
        containerWidth = 2 * serviceWidth + 40 + 40; // Two services + 40px spacing + 40px padding
        containerHeight = prodHeight;
        colsPerRow = 2;
      } else if (isTablet) {
        row = Math.floor(index / 2);
        col = index % 2;
        serviceWidth = 200;
        containerPadding = 30;
        headerHeight = 70;
        serviceHeight = 150;
        rowSpacing = serviceHeight + 30; // service height + padding
        // Calculate container width based on service count and spacing
        const spacing = 50; // Minimum spacing between services
        const maxCol = Math.min(1, 1); // For 2 columns, max column index is 1
        const maxServiceX = 30 + maxCol * (serviceWidth + spacing); // containerPadding + maxCol * (serviceWidth + spacing)
        containerWidth = maxServiceX + serviceWidth + 30; // maxX + serviceWidth + rightPadding
        containerHeight = prodHeight;
        colsPerRow = 2;
      } else {
        row = Math.floor(index / 3);
        col = index % 3;
        serviceWidth = 240;
        containerPadding = 40;
        headerHeight = 80;
        serviceHeight = 160;
        rowSpacing = serviceHeight + 40; // service height + padding
        containerWidth = Math.min(windowSize.width - 200, 1200);
        containerHeight = prodHeight;
        colsPerRow = 3;
      }

      // Calculate consistent spacing
      const availableWidth = containerWidth - 2 * containerPadding;
      const totalServiceWidth = colsPerRow * serviceWidth;
      const remainingSpace = availableWidth - totalServiceWidth;

      const spacingBetweenServices = isMobile
        ? Math.max(40, colsPerRow > 1 ? remainingSpace / (colsPerRow - 1) : 0) // Minimum 40px spacing on mobile
        : isTablet
        ? Math.max(80, colsPerRow > 1 ? remainingSpace / (colsPerRow - 1) : 0) // Minimum 80px spacing on tablet
        : colsPerRow > 1
        ? remainingSpace / (colsPerRow - 1)
        : 0;

      // Calculate position with consistent margins
      // For mobile, center the service horizontally within the full-width container
      const x = isMobile
        ? containerPadding + col * (serviceWidth + spacingBetweenServices) // Two columns on mobile
        : containerPadding + col * (serviceWidth + spacingBetweenServices);

      const y =
        containerPadding +
        headerHeight +
        row * (serviceHeight + (isMobile ? 20 : isTablet ? 30 : 40));

      flowNodes.push({
        id: service.id,
        type: 'service',
        position: { x, y },
        data: { ...service },
        parentNode: service.parent,
        extent: 'parent',
        draggable: true,
        zIndex: 10,
      } as unknown as Node);
    });

    stagingServicesList.forEach((service: any, index: number) => {
      let containerPadding: number,
        headerHeight: number,
        serviceWidth: number,
        containerWidth: number;

      if (isMobile) {
        containerPadding = 20;
        headerHeight = 60;
        serviceWidth = 180; // Fixed width for mobile services
        containerWidth = 2 * serviceWidth + 40 + 40; // Two services + 40px spacing + 40px padding
      } else if (isTablet) {
        containerPadding = 30;
        headerHeight = 70;
        serviceWidth = 200;
        containerWidth = 2 * serviceWidth + 40 + 40; // Two services + 40px spacing + 40px padding
      } else {
        containerPadding = 40;
        headerHeight = 80;
        serviceWidth = 240;
        containerWidth = Math.min(windowSize.width - 200, 1200);
      }

      // Calculate consistent spacing for staging services (single row)
      const availableWidth = containerWidth - 2 * containerPadding;
      const totalServiceWidth = stagingServicesList.length * serviceWidth;
      const remainingSpace = availableWidth - totalServiceWidth;
      const spacingBetweenServices = isMobile
        ? Math.max(
            40,
            stagingServicesList.length > 1
              ? remainingSpace / (stagingServicesList.length - 1)
              : 0
          ) // Minimum 40px spacing on mobile
        : isTablet
        ? Math.max(
            80,
            stagingServicesList.length > 1
              ? remainingSpace / (stagingServicesList.length - 1)
              : 0
          ) // Minimum 80px spacing on tablet
        : stagingServicesList.length > 1
        ? remainingSpace / (stagingServicesList.length - 1)
        : 0;

      // Calculate position with consistent margins
      // For mobile, center the service horizontally within the full-width container
      const x = isMobile
        ? containerPadding + index * (serviceWidth + spacingBetweenServices) // Two columns on mobile
        : containerPadding + index * (serviceWidth + spacingBetweenServices);
      const y = containerPadding + headerHeight;

      flowNodes.push({
        id: service.id,
        type: 'service',
        position: { x, y },
        data: { ...service },
        parentNode: service.parent,
        extent: 'parent',
        draggable: true,
        zIndex: 10,
      } as unknown as Node);
    });

    const flowEdges: Edge[] = mockServicesData.connections.map((conn: any) => ({
      id: conn.id,
      source: conn.source,
      target: conn.target,
      type: 'custom',
      data: { ...conn },
      animated: conn.status === 'HEALTHY',
      style: {
        stroke:
          conn.status === 'HEALTHY'
            ? '#10b981'
            : conn.status === 'DEGRADED'
            ? '#f59e0b'
            : '#ef4444',
        strokeWidth: 4,
        strokeOpacity: 0.8,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color:
          conn.status === 'HEALTHY'
            ? '#10b981'
            : conn.status === 'DEGRADED'
            ? '#f59e0b'
            : '#ef4444',
      },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [setNodes, setEdges, windowSize, calculateContainerHeight]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedItem && selectedItem.type === 'connection') {
        setRealTimeMetrics(generateMetrics());
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [selectedItem]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node: any) => {
          if (node.type === 'service' && Math.random() < 0.1) {
            const newStatus = getRandomStatus();
            return {
              ...node,
              data: { ...node.data, status: newStatus },
            } as any;
          }
          return node;
        })
      );

      setEdges((prevEdges) =>
        prevEdges.map((edge: any) => {
          if (Math.random() < 0.05) {
            const newStatus = getRandomStatus();
            return {
              ...edge,
              data: { ...edge.data, status: newStatus },
              animated: newStatus === 'HEALTHY',
              style: {
                ...edge.style,
                stroke:
                  newStatus === 'HEALTHY'
                    ? '#10b981'
                    : newStatus === 'DEGRADED'
                    ? '#f59e0b'
                    : '#ef4444',
                strokeWidth: 4,
                strokeOpacity: 0.8,
              },
              markerEnd: {
                ...edge.markerEnd,
                color:
                  newStatus === 'HEALTHY'
                    ? '#10b981'
                    : newStatus === 'DEGRADED'
                    ? '#f59e0b'
                    : '#ef4444',
              },
            } as any;
          }
          return edge;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    if (node.type === 'service') {
      setSelectedItem({ type: 'service', data: node.data });
      setIsPanelOpen(true);
    }
  }, []);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: any) => {
    setSelectedItem({ type: 'connection', data: edge.data });
    setRealTimeMetrics(generateMetrics());
    setIsPanelOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedItem(null);
    setIsPanelOpen(false);
  }, []);

  const onNodeDrag = useCallback(
    (event: React.MouseEvent, node: any) => {
      if (node.type === 'service' && node.parentNode) {
        const parentNode = nodes.find((n) => n.id === node.parentNode);
        if (parentNode) {
          const isMobile = windowSize.width < 768;
          const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

          let containerPadding: number,
            headerHeight: number,
            serviceWidth: number,
            serviceHeight: number,
            containerWidth: number,
            containerHeight: number;

          // Get service count for the parent environment
          const parentServices = nodes.filter(
            (n: any) => n.type === 'service' && n.parentNode === node.parentNode
          );
          const dynamicHeight = calculateContainerHeight(
            parentServices.length,
            isMobile,
            isTablet,
            node.parentNode
          );

          if (isMobile) {
            containerPadding = 20;
            headerHeight = 60;
            serviceWidth = windowSize.width - 40; // Full width minus padding
            serviceHeight = 140;
            containerWidth = windowSize.width; // Full viewport width
            containerHeight = dynamicHeight;
          } else if (isTablet) {
            containerPadding = 30;
            headerHeight = 70;
            serviceWidth = 200;
            serviceHeight = 150;
            containerWidth = Math.min(windowSize.width - 100, 800);
            containerHeight = dynamicHeight;
          } else {
            containerPadding = 40;
            headerHeight = 80;
            serviceWidth = 240;
            serviceHeight = 160;
            containerWidth = Math.min(windowSize.width - 200, 1200);
            containerHeight = dynamicHeight;
          }

          const minX = containerPadding;
          const minY = containerPadding + headerHeight;
          const maxX = containerWidth - serviceWidth - containerPadding;
          // Allow bottom row to reach its intended position by using a more generous maxY
          const maxY = containerHeight - serviceHeight;

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
    const serviceNodes = nodes.filter((n: any) => n.type === 'service');
    const healthy = serviceNodes.filter(
      (n: any) => n.data.status === 'HEALTHY'
    ).length;
    const degraded = serviceNodes.filter(
      (n: any) => n.data.status === 'DEGRADED'
    ).length;
    const offline = serviceNodes.filter(
      (n: any) => n.data.status === 'OFFLINE'
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
          <header
            className={`border-b bg-card/95 backdrop-blur-sm ${
              windowSize.width < 768 ? 'p-2' : 'p-4 md:p-6'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between max-w-full gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  <h1 className="text-lg md:text-2xl font-bold">
                    Service Health Dashboard
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3">
                  <Card className="px-2 md:px-4 py-1 md:py-2 bg-green-500/10 border-green-500/20">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs md:text-sm font-medium">
                        {dashboardStats.healthy} Healthy
                      </span>
                    </div>
                  </Card>
                  <Card className="px-2 md:px-4 py-1 md:py-2 bg-amber-500/10 border-amber-500/20">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="text-xs md:text-sm font-medium">
                        {dashboardStats.degraded} Degraded
                      </span>
                    </div>
                  </Card>
                  <Card className="px-2 md:px-4 py-1 md:py-2 bg-red-500/10 border-red-500/20">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs md:text-sm font-medium">
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
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="px-2 md:px-4 text-xs md:text-sm"
                >
                  {isDarkMode ? 'Light' : 'Dark'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className="px-2 md:px-4 text-xs md:text-sm"
                >
                  {isPanelOpen ? (
                    <PanelRightClose className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                  ) : (
                    <PanelRight className="h-3 w-3 md:h-4 md:w-4 md:mr-2" />
                  )}
                  <span className="hidden md:inline">Panel</span>
                </Button>
              </div>
            </div>
          </header>

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
                  zoom: 0.8,
                }}
                snapToGrid={false}
                nodesDraggable={true}
                nodesConnectable={false}
                elementsSelectable={true}
              >
                <Background gap={20} size={1} />
                {/* <Controls
                  className={`${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-card border'
                  } scale-75 sm:scale-90 md:scale-100`}
                /> */}
                {/* <MiniMap
                  className={`${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-card border'
                  } hidden sm:block`}
                  nodeStrokeWidth={3}
                  nodeColor={(node: any) => {
                    if (node.data?.status === 'HEALTHY') return '#10b981';
                    if (node.data?.status === 'DEGRADED') return '#f59e0b';
                    if (node.data?.status === 'OFFLINE') return '#ef4444';
                    return '#6b7280';
                  }}
                /> */}
              </ReactFlow>
            </div>

            {/* Details Panel */}
            {isPanelOpen && (
              <DetailsPanel
                selectedItem={selectedItem as any}
                realTimeMetrics={realTimeMetrics}
                onClose={() => setIsPanelOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ServiceHealthDashboard;
