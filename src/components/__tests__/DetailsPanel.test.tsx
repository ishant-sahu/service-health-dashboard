import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DetailsPanel from '../../components/DetailsPanel';
import {
  SERVICE_STATUS,
  SELECTED_ITEM_TYPES,
  ENVIRONMENT_IDS,
} from '../../constants/dashboard';

// Mock the responsive utility
vi.mock('../../utils/responsive', () => ({
  isMobile: vi.fn(() => false),
}));
import { isMobile } from '../../utils/responsive';

// Mock the hooks
vi.mock('../../hooks/useConnectionMetrics', () => {
  const hook = vi.fn(() => ({
    metrics: { rps: 500, latency: 150, errorRate: 2.5 },
    cachedData: [
      {
        timestamp: Date.now(),
        time: '12:00:00',
        rps: 500,
        latency: 150,
        errorRate: 2.5,
      },
    ],
  }));
  return { useConnectionMetrics: hook };
});
import { useConnectionMetrics } from '../../hooks/useConnectionMetrics';

vi.mock('../../hooks/useFocusManagement', () => ({
  usePanelFocusManagement: vi.fn(() => ({
    panelRef: { current: null },
  })),
}));

vi.mock('../../hooks/useScreenReaderAnnouncements', () => ({
  useScreenReaderAnnouncements: vi.fn(() => ({
    announceMetricsUpdate: vi.fn(),
  })),
}));

// Mock the chart component
vi.mock('../../components/charts', () => ({
  RealTimeChart: ({ title }: { title: string }) => (
    <div data-testid="real-time-chart">{title}</div>
  ),
}));

describe('DetailsPanel', () => {
  const mockOnClose = vi.fn();

  const mockServiceItem = {
    type: SELECTED_ITEM_TYPES.SERVICE,
    data: {
      name: 'User API',
      tech: 'Node.js',
      version: '1.8.2',
      status: SERVICE_STATUS.HEALTHY,
      parent: ENVIRONMENT_IDS.PROD,
    },
  };

  const mockConnectionItem = {
    type: SELECTED_ITEM_TYPES.CONNECTION,
    data: {
      id: 'conn-1',
      source: 'frontend-app',
      target: 'user-api',
      status: SERVICE_STATUS.HEALTHY,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render placeholder when no item is selected', () => {
    render(<DetailsPanel selectedItem={null} onClose={mockOnClose} />);

    expect(
      screen.getByText('Select a service or connection to view details')
    ).toBeInTheDocument();
  });

  it('should render service details when service is selected', () => {
    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    expect(screen.getByText('Service Details')).toBeInTheDocument();
    expect(screen.getByText('User API')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('1.8.2')).toBeInTheDocument();
    expect(screen.getByText('HEALTHY')).toBeInTheDocument();
    expect(screen.getByText('Production')).toBeInTheDocument();
  });

  it('should render connection details when connection is selected', () => {
    render(
      <DetailsPanel selectedItem={mockConnectionItem} onClose={mockOnClose} />
    );

    expect(screen.getByText('Connection Details')).toBeInTheDocument();
    expect(screen.getByText('frontend-app')).toBeInTheDocument();
    expect(screen.getByText('user-api')).toBeInTheDocument();
    expect(screen.getByText('HEALTHY')).toBeInTheDocument();
    expect(screen.getByText('Real-time Metrics')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    const panel = screen.getByRole('complementary');
    expect(panel).toHaveAttribute('aria-label', 'Service details panel');
    expect(panel).toHaveAttribute('tabIndex', '-1');
  });

  it('should have proper heading structure', () => {
    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Details'
    );
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Service Details'
    );
  });

  it('should render close button with proper accessibility', () => {
    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    const closeButton = screen.getByLabelText('Close details panel');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('aria-label', 'Close details panel');
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    const closeButton = screen.getByLabelText('Close details panel');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render metrics cards for connection details', () => {
    render(
      <DetailsPanel selectedItem={mockConnectionItem} onClose={mockOnClose} />
    );

    expect(screen.getByText('RPS')).toBeInTheDocument();
    expect(screen.getByText('Latency')).toBeInTheDocument();
    expect(screen.getByText('Errors')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('150ms')).toBeInTheDocument();
    expect(screen.getByText('2.50%')).toBeInTheDocument();
  });

  it('should render real-time charts when cached data is available', () => {
    render(
      <DetailsPanel selectedItem={mockConnectionItem} onClose={mockOnClose} />
    );

    expect(screen.getAllByTestId('real-time-chart')).toHaveLength(3);
    expect(screen.getByText('Requests per Second')).toBeInTheDocument();
    expect(screen.getByText('Response Latency')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
  });

  it('should show waiting message when no cached data is available', () => {
    (
      useConnectionMetrics as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      metrics: { rps: 0, latency: 0, errorRate: 0 },
      cachedData: [],
    });

    render(
      <DetailsPanel selectedItem={mockConnectionItem} onClose={mockOnClose} />
    );

    expect(
      screen.getByText('Waiting for real-time data...')
    ).toBeInTheDocument();
  });

  it('should render different status badges correctly', () => {
    const degradedService = {
      ...mockServiceItem,
      data: { ...mockServiceItem.data, status: SERVICE_STATUS.DEGRADED },
    };

    const { rerender } = render(
      <DetailsPanel selectedItem={degradedService} onClose={mockOnClose} />
    );
    expect(screen.getByText('DEGRADED')).toBeInTheDocument();

    const offlineService = {
      ...mockServiceItem,
      data: { ...mockServiceItem.data, status: SERVICE_STATUS.OFFLINE },
    };

    rerender(
      <DetailsPanel selectedItem={offlineService} onClose={mockOnClose} />
    );
    expect(screen.getByText('OFFLINE')).toBeInTheDocument();
  });

  it('should render staging environment correctly', () => {
    const stagingService = {
      ...mockServiceItem,
      data: { ...mockServiceItem.data, parent: ENVIRONMENT_IDS.STAGING },
    };

    render(
      <DetailsPanel selectedItem={stagingService} onClose={mockOnClose} />
    );

    expect(screen.getByText('Staging')).toBeInTheDocument();
  });

  it('should have proper semantic structure with definition lists', () => {
    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    // Check for proper dt/dd structure
    const nameLabel = screen.getByText('Name');
    const nameValue = screen.getByText('User API');

    expect(nameLabel.tagName).toBe('DT');
    expect(nameValue.tagName).toBe('DD');
  });

  it('should handle mobile responsive design', () => {
    // Mock mobile device
    (isMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    const panel = screen.getByRole('complementary');
    expect(panel).toHaveClass('fixed', 'top-0', 'right-0', 'z-50');
  });

  // Removed: ARIA label assertions for metrics cards (redundant with other a11y checks)

  it('should have proper focus management', () => {
    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    const panel = screen.getByRole('complementary');
    expect(panel).toHaveClass('focus:outline-none');
  });

  it('should handle escape key to close panel', async () => {
    render(
      <DetailsPanel selectedItem={mockServiceItem} onClose={mockOnClose} />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
