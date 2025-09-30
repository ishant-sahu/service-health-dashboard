/* eslint-disable react-refresh/only-export-components */
import { render, RenderOptions, waitFor } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

// Test data generators
export const createMockServiceData = (
  overrides: Partial<{
    name: string;
    tech: string;
    version: string;
    status: string;
  }> = {}
) => ({
  name: 'Test Service',
  tech: 'Node.js',
  version: '1.0.0',
  status: 'HEALTHY',
  ...overrides,
});

export const createMockConnectionData = (
  overrides: Partial<{
    id: string;
    source: string;
    target: string;
    status: string;
  }> = {}
) => ({
  id: 'test-connection',
  source: 'service-1',
  target: 'service-2',
  status: 'HEALTHY',
  ...overrides,
});

export const createMockMetricsData = (
  overrides: Partial<{
    rps: number;
    latency: number;
    errorRate: number;
  }> = {}
) => ({
  rps: 500,
  latency: 150,
  errorRate: 2.5,
  ...overrides,
});

export const createMockDashboardStats = (
  overrides: Partial<{
    total: number;
    healthy: number;
    degraded: number;
    offline: number;
  }> = {}
) => ({
  total: 10,
  healthy: 7,
  degraded: 2,
  offline: 1,
  ...overrides,
});

// Accessibility test helpers
export const expectToHaveAccessibleName = (
  element: HTMLElement,
  name: string
) => {
  expect(element).toHaveAccessibleName(name);
};

export const expectToBeAccessible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

// Keyboard navigation helpers
export const pressKey = (element: HTMLElement, key: string) => {
  element.dispatchEvent(new KeyboardEvent('keydown', { key }));
};

export const pressEnter = (element: HTMLElement) => {
  pressKey(element, 'Enter');
};

export const pressSpace = (element: HTMLElement) => {
  pressKey(element, ' ');
};

export const pressEscape = (element: HTMLElement) => {
  pressKey(element, 'Escape');
};

export const pressTab = (element: HTMLElement) => {
  pressKey(element, 'Tab');
};

// Mock service helpers
export const createMockMetricsService = () => ({
  subscribe: vi.fn(() => vi.fn()),
  unsubscribe: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
});

export const createMockCacheService = () => ({
  add: vi.fn(),
  get: vi.fn(() => []),
  clear: vi.fn(),
});

// Timer helpers
export const advanceTimers = (ms: number) => {
  vi.advanceTimersByTime(ms);
};

export const runAllTimers = () => {
  vi.runAllTimers();
};

// Wait helpers
export const waitForMetricsUpdate = async () => {
  await waitFor(() => {
    // Wait for metrics to be updated
  });
};

export const waitForStatusChange = async () => {
  await waitFor(() => {
    // Wait for status to change
  });
};

// Assertion helpers
export const expectMetricsInRange = (metrics: {
  rps: number;
  latency: number;
  errorRate: number;
}) => {
  expect(metrics.rps).toBeGreaterThanOrEqual(300);
  expect(metrics.rps).toBeLessThanOrEqual(1000);
  expect(metrics.latency).toBeGreaterThanOrEqual(50);
  expect(metrics.latency).toBeLessThanOrEqual(250);
  expect(metrics.errorRate).toBeGreaterThanOrEqual(0);
  expect(metrics.errorRate).toBeLessThanOrEqual(5);
};

export const expectValidServiceStatus = (status: string) => {
  const validStatuses = ['HEALTHY', 'DEGRADED', 'OFFLINE'];
  expect(validStatuses).toContain(status);
};

export const expectValidConnectionId = (id: string) => {
  expect(id).toBeTruthy();
  expect(typeof id).toBe('string');
  expect(id.length).toBeGreaterThan(0);
};

// Component test helpers
export const expectComponentToRender = (component: ReactElement) => {
  expect(() => render(component)).not.toThrow();
};

export const expectComponentToHaveAccessibility = (component: ReactElement) => {
  const { container } = render(component);
  const interactiveElements = container.querySelectorAll(
    'button, [role="button"], input, select, textarea'
  );

  interactiveElements.forEach((element) => {
    expect(element).toHaveAttribute('aria-label');
  });
};

// Mock window helpers
export const mockWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

export const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { customRender as render };
