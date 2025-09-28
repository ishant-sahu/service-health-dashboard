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

// Environment IDs
export const ENVIRONMENT_IDS = {
  PROD: 'prod-env',
  STAGING: 'staging-env',
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
} as const;
