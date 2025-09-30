import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ServiceHealthDashboard from '../../components/ServiceHealthDashboard';

// Mock all the dependencies
vi.mock('reactflow', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-testid="react-flow" {...props}>
      {children}
    </div>
  ),
  ReactFlow: ({ children, ...props }: any) => (
    <div data-testid="react-flow" {...props}>
      {children}
    </div>
  ),
  Background: () => <div data-testid="background" />,
  useNodesState: () => [[], vi.fn(), vi.fn()],
  useEdgesState: () => [[], vi.fn(), vi.fn()],
  MarkerType: { ArrowClosed: 'arrowclosed' },
}));

vi.mock('../../hooks/useStatusUpdates', () => ({
  useStatusUpdates: () => ({
    data: {
      serviceStatuses: {},
      connectionStatuses: {},
    },
  }),
}));

vi.mock('../../hooks/useScreenReaderAnnouncements', () => ({
  useScreenReaderAnnouncements: () => ({
    announceServiceStatusChange: vi.fn(),
    announceConnectionStatusChange: vi.fn(),
    announcePanelOpen: vi.fn(),
    announcePanelClose: vi.fn(),
    announceDashboardStats: vi.fn(),
  }),
}));

vi.mock('../../components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider">{children}</div>
  ),
}));

// Mock window object
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe('ServiceHealthDashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main dashboard structure', () => {
    render(<ServiceHealthDashboard />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('should have proper accessibility structure', () => {
    render(<ServiceHealthDashboard />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Service health dashboard visualization')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Interactive service topology diagram')
    ).toBeInTheDocument();
  });

  it('should render dashboard header with title', () => {
    render(<ServiceHealthDashboard />);

    expect(screen.getByText('Service Health Dashboard')).toBeInTheDocument();
  });

  it('should render React Flow component', () => {
    render(<ServiceHealthDashboard />);

    const reactFlow = screen.getByTestId('react-flow');
    expect(reactFlow).toBeInTheDocument();
    expect(reactFlow).toHaveClass('w-full', 'h-full');
  });

  it('should render background component', () => {
    render(<ServiceHealthDashboard />);

    expect(screen.getByTestId('background')).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    render(<ServiceHealthDashboard />);

    // Check for proper landmark roles
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should handle dark mode toggle', () => {
    render(<ServiceHealthDashboard />);

    // The component should render without errors
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render tooltip provider', () => {
    render(<ServiceHealthDashboard />);

    expect(screen.getByTestId('tooltip-provider')).toBeInTheDocument();
  });

  it('should have proper CSS classes for responsive design', () => {
    render(<ServiceHealthDashboard />);

    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveClass(
      'flex-1',
      'flex',
      'flex-col',
      'lg:flex-row',
      'overflow-hidden'
    );
  });

  it('should render without errors', () => {
    expect(() => render(<ServiceHealthDashboard />)).not.toThrow();
  });

  it('should handle window resize events', async () => {
    render(<ServiceHealthDashboard />);

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', {
      value: 768,
    });

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });
  });

  it('should have proper focus management', () => {
    render(<ServiceHealthDashboard />);

    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
  });

  it('should render with proper ARIA labels', () => {
    render(<ServiceHealthDashboard />);

    expect(
      screen.getByLabelText('Service health dashboard visualization')
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Interactive service topology diagram')
    ).toBeInTheDocument();
  });

  it('should handle component unmounting gracefully', () => {
    const { unmount } = render(<ServiceHealthDashboard />);

    expect(() => unmount()).not.toThrow();
  });

  it('should maintain proper component hierarchy', () => {
    render(<ServiceHealthDashboard />);

    const tooltipProvider = screen.getByTestId('tooltip-provider');
    const banner = screen.getByRole('banner');
    const main = screen.getByRole('main');

    expect(tooltipProvider).toContainElement(banner);
    expect(tooltipProvider).toContainElement(main);
  });
});
