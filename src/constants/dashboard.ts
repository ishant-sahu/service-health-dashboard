// Node types
export const NODE_TYPES = {
  SERVICE: 'service',
  ENVIRONMENT: 'environment',
} as const;

// Selected item types
export const SELECTED_ITEM_TYPES = {
  SERVICE: 'service',
  CONNECTION: 'connection',
} as const;

// Service status values
export const SERVICE_STATUS = {
  HEALTHY: 'HEALTHY',
  DEGRADED: 'DEGRADED',
  OFFLINE: 'OFFLINE',
} as const;

// Device type values
export const DEVICE_TYPES = {
  MOBILE: 'MOBILE',
  TABLET: 'TABLET',
  DESKTOP: 'DESKTOP',
} as const;

// Environment IDs
export const ENVIRONMENT_IDS = {
  PROD: 'prod-env',
  STAGING: 'staging-env',
} as const;

// Environment display names
export const ENVIRONMENT_NAMES = {
  PROD: 'Production',
  STAGING: 'Staging',
} as const;

// Dashboard layout constants
export const LAYOUT_CONSTANTS = {
  // Container dimensions
  MOBILE: {
    CONTAINER_PADDING: 20,
    HEADER_HEIGHT: 60,
    SERVICE_WIDTH: 180,
    SERVICE_HEIGHT: 140,
    COLS_PER_ROW: 2,
    SPACING_BETWEEN_SERVICES: 40,
    SPACING_BETWEEN_ROWS: 20,
    MIN_HEIGHT: 200,
    CONTAINER_WIDTH_MULTIPLIER: 2, // For calculating container width
    CONTAINER_WIDTH_SPACING: 40,
    CONTAINER_WIDTH_PADDING: 40,
  },
  TABLET: {
    CONTAINER_PADDING: 30,
    HEADER_HEIGHT: 70,
    SERVICE_WIDTH: 200,
    SERVICE_HEIGHT: 150,
    COLS_PER_ROW: 2,
    SPACING_BETWEEN_SERVICES: 80,
    SPACING_BETWEEN_ROWS: 30,
    MIN_HEIGHT: 250,
    CONTAINER_WIDTH_MULTIPLIER: 2,
    CONTAINER_WIDTH_SPACING: 40,
    CONTAINER_WIDTH_PADDING: 40,
  },
  DESKTOP: {
    CONTAINER_PADDING: 40,
    HEADER_HEIGHT: 80,
    SERVICE_WIDTH: 240,
    SERVICE_HEIGHT: 160,
    COLS_PER_ROW: 3,
    SPACING_BETWEEN_SERVICES: 0, // Calculated dynamically
    SPACING_BETWEEN_ROWS: 40,
    MIN_HEIGHT: 300,
    MAX_CONTAINER_WIDTH: 1200,
    VIEWPORT_MARGIN: 200,
    CONTAINER_WIDTH_MULTIPLIER: 3, // For calculating container width
    CONTAINER_WIDTH_SPACING: 40,
    CONTAINER_WIDTH_PADDING: 40,
  },

  // Environment positioning
  ENVIRONMENT_GAPS: {
    MOBILE: 20,
    TABLET: 30,
    DESKTOP: 50,
  },

  // Environment container positioning
  ENVIRONMENT_POSITIONS: {
    MOBILE: {
      CENTER_X: 20,
      TOP_Y: 20,
    },
    TABLET: {
      CONTAINER_WIDTH: 590,
    },
    DESKTOP: {
      CONTAINER_WIDTH: 1200,
      TOP_Y: 50,
    },
  },

  // Viewport breakpoints
  BREAKPOINTS: {
    MOBILE: 768,
    TABLET: 1024,
  },

  // React Flow settings
  REACT_FLOW: {
    DEFAULT_ZOOM: 0.8,
    BACKGROUND_GAP: 20,
    BACKGROUND_SIZE: 1,
    EDGE_STROKE_WIDTH: 4,
    EDGE_STROKE_OPACITY: 0.8,
  },

  // Animation intervals
  INTERVALS: {
    METRICS_UPDATE: 2500,
    STATUS_UPDATE: 5000,
    STATUS_CHANGE_PROBABILITY: 0.1,
    EDGE_CHANGE_PROBABILITY: 0.05,
  },
} as const;

// Color constants
export const COLOR_CONSTANTS = {
  STATUS: {
    HEALTHY: '#10b981',
    DEGRADED: '#f59e0b',
    OFFLINE: '#ef4444',
  },
  STATUS_BACKGROUNDS: {
    HEALTHY: 'bg-green-500/10',
    DEGRADED: 'bg-amber-500/10',
    OFFLINE: 'bg-red-500/10',
  },
  STATUS_BORDERS: {
    HEALTHY: 'border-green-500/20',
    DEGRADED: 'border-amber-500/20',
    OFFLINE: 'border-red-500/20',
  },
  STATUS_DOTS: {
    HEALTHY: 'bg-green-500',
    DEGRADED: 'bg-amber-500',
    OFFLINE: 'bg-red-500',
  },
  STATUS_TEXT_COLORS: {
    HEALTHY: 'text-green-500',
    DEGRADED: 'text-amber-500',
    OFFLINE: 'text-red-500',
  },
} as const;

// Header constants
export const HEADER_CONSTANTS = {
  ICON_SIZES: {
    MOBILE: 'h-6 w-6',
    DESKTOP: 'h-8 w-8',
  },
  TITLE_SIZES: {
    MOBILE: 'text-lg',
    DESKTOP: 'text-2xl',
  },
  PADDING: {
    MOBILE: 'p-2',
    DESKTOP: 'p-4 md:p-6',
  },
  STAT_CARD_PADDING: {
    MOBILE: 'px-2 py-1',
    DESKTOP: 'px-4 py-2',
  },
  STAT_DOT_SIZES: {
    MOBILE: 'w-2 h-2',
    DESKTOP: 'w-3 h-3',
  },
  STAT_TEXT_SIZES: {
    MOBILE: 'text-xs',
    DESKTOP: 'text-sm',
  },
  BUTTON_SIZES: {
    MOBILE: 'px-2 text-xs',
    DESKTOP: 'px-4 text-sm',
  },
  ICON_SIZES_BUTTON: {
    MOBILE: 'h-3 w-3',
    DESKTOP: 'h-4 w-4',
  },
  // Text labels
  TEXTS: {
    TITLE: 'Service Health Dashboard',
    HEALTHY: 'Healthy',
    DEGRADED: 'Degraded',
    OFFLINE: 'Offline',
    LIGHT: 'Light',
    DARK: 'Dark',
    PANEL: 'Panel',
  },
  // Gap values
  GAPS: {
    SMALL: 'gap-1',
    MEDIUM: 'gap-2',
    LARGE: 'gap-3',
    XLARGE: 'gap-4',
    XXLARGE: 'gap-6',
  },
  // Responsive gaps
  RESPONSIVE_GAPS: {
    MOBILE: 'gap-2',
    DESKTOP: 'gap-3',
  },
  // Layout classes
  LAYOUT: {
    HEADER_CLASSES: 'border-b bg-card/95 backdrop-blur-sm',
    FLEX_CONTAINER:
      'flex flex-col lg:flex-row lg:items-center justify-between max-w-full',
    TITLE_CONTAINER: 'flex flex-col md:flex-row md:items-center',
    STATS_CONTAINER: 'flex flex-wrap',
    BUTTONS_CONTAINER: 'flex items-center',
    STAT_CARD_CLASSES: 'rounded-full animate-pulse',
    BUTTON_ICON_SPACING: 'md:mr-2',
    HIDDEN_MOBILE: 'hidden md:inline',
  },
} as const;

// Details panel constants
export const DETAILS_PANEL_CONSTANTS = {
  // Text labels
  TEXTS: {
    TITLE: 'Details Panel',
    SERVICE_DETAILS: 'Service Details',
    CONNECTION_DETAILS: 'Connection Details',
    REAL_TIME_METRICS: 'Real-time Metrics',
    SELECT_PLACEHOLDER: 'Select a service or connection to view details',
    NAME: 'Name',
    TYPE: 'Type',
    VERSION: 'Version',
    STATUS: 'Status',
    ENVIRONMENT: 'Environment',
    SOURCE_SERVICE: 'Source Service',
    TARGET_SERVICE: 'Target Service',
    CONNECTION_STATUS: 'Connection Status',
    RPS: 'RPS',
    LATENCY: 'Latency',
    ERRORS: 'Errors',
    REQUESTS_PER_SECOND: 'Requests per Second',
    RESPONSE_LATENCY: 'Response Latency',
    ERROR_RATE: 'Error Rate',
    SHOWING_DATA: 'Showing last',
    DATA_POINTS: 'data points • Updates every 2-3 seconds',
    WAITING_DATA: 'Waiting for real-time data...',
  },
  // Panel dimensions
  DIMENSIONS: {
    MOBILE_WIDTH: 'w-full',
    DESKTOP_WIDTH: 'w-96',
    HEIGHT: 'h-full',
  },
  // Spacing
  SPACING: {
    MOBILE_PADDING: 'p-4',
    DESKTOP_PADDING: 'p-6',
    MOBILE_SPACE: 'space-y-6',
    DESKTOP_SPACE: 'space-y-8',
  },
  // Text sizes
  TEXT_SIZES: {
    MOBILE_TITLE: 'text-lg',
    DESKTOP_TITLE: 'text-xl',
    SECTION_TITLE: 'text-lg',
    LABEL: 'text-sm',
    VALUE: 'text-sm',
    METRIC_LABEL: 'text-xs',
    METRIC_VALUE: 'text-lg',
    FOOTER: 'text-xs',
  },
  // Chart colors
  CHART_COLORS: {
    RPS: '#3b82f6',
    LATENCY: '#10b981',
    ERROR_RATE: '#f59e0b',
  },
  // Chart dimensions
  CHART_HEIGHT: 150,
  // Icon sizes
  ICON_SIZES: {
    PLACEHOLDER: 'h-12 w-12',
    SECTION: 'h-5 w-5',
    METRIC: 'h-3 w-3',
    METRICS_HEADER: 'h-4 w-4',
    CLOSE: 'h-4 w-4',
  },
  // Grid layouts
  GRID: {
    METRICS: 'grid-cols-3',
  },
  // Status dot sizes
  STATUS_DOT: 'w-2 h-2',
  // Animation classes
  ANIMATION: {
    PULSE: 'animate-pulse',
  },
} as const;

// Environment node constants
export const ENVIRONMENT_NODE_CONSTANTS = {
  // Text labels
  TEXTS: {
    ENVIRONMENT: 'Environment',
  },
  // Service dimensions
  SERVICE_DIMENSIONS: {
    MOBILE_WIDTH: 180,
    TABLET_WIDTH: 200,
  },
  // Spacing values
  SPACING: {
    MOBILE_SERVICE_SPACING: 40,
    MOBILE_PADDING: 40,
    TABLET_SERVICE_SPACING: 80,
    TABLET_PADDING: 30,
    TABLET_EXTRA_MARGIN: 50,
  },
  // Container dimensions
  CONTAINER_DIMENSIONS: {
    DESKTOP_WIDTH: 1200,
    PRODUCTION_HEIGHT: {
      MOBILE: 700,
      TABLET: 600,
      DESKTOP: 500,
    },
    STAGING_HEIGHT: {
      MOBILE: 350,
      TABLET: 300,
      DESKTOP: 500,
    },
  },
  // Grid settings
  GRID: {
    TABLET_MAX_COL: 1,
  },
  // Icon sizes
  ICON_SIZES: {
    MOBILE: 'h-7 w-7',
    TABLET: 'md:h-8 md:w-8',
    DESKTOP: 'lg:h-9 lg:w-9',
  },
  // Text sizes
  TEXT_SIZES: {
    TITLE_MOBILE: 'text-xl',
    TITLE_TABLET: 'md:text-2xl',
    TITLE_DESKTOP: 'lg:text-3xl',
    BADGE_MOBILE: 'text-sm',
    BADGE_TABLET: 'md:text-base',
    BADGE_DESKTOP: 'lg:text-lg',
  },
  // Badge padding
  BADGE_PADDING: {
    MOBILE: 'px-3 py-1.5',
    TABLET: 'md:px-4 md:py-2',
    DESKTOP: 'lg:px-5',
  },
  // Colors
  COLORS: {
    PRODUCTION: {
      BORDER: 'border-blue-500/30',
      BACKGROUND: 'bg-blue-500/5',
      ICON: 'text-blue-500',
      BADGE_BORDER: 'border-blue-500',
      BADGE_TEXT: 'text-blue-500',
    },
    STAGING: {
      BORDER: 'border-purple-500/30',
      BACKGROUND: 'bg-purple-500/5',
      ICON: 'text-purple-500',
      BADGE_BORDER: 'border-purple-500',
      BADGE_TEXT: 'text-purple-500',
    },
  },
  // Layout classes
  LAYOUT: {
    CARD_CLASSES: 'p-6 relative backdrop-blur-sm z-0',
    HEADER_CLASSES: 'flex items-center gap-3 mb-6',
  },
} as const;
