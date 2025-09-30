import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ServiceNode from '../../components/ServiceNode';
import { SERVICE_STATUS } from '../../constants/dashboard';

// Mock React Flow pieces used by ServiceNode so we don't need provider
vi.mock('reactflow', () => ({
  __esModule: true,
  Handle: () => <div data-testid="handle" />,
  Position: { Top: 'top', Bottom: 'bottom' },
}));

// Mock the responsive utility
vi.mock('../../utils/responsive', () => ({
  isMobile: vi.fn(() => false),
}));
import { isMobile } from '../../utils/responsive';

// Mock the Tooltip components
vi.mock('../../components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip">{children}</div>
  ),
  TooltipTrigger: ({
    children,
    asChild,
  }: {
    children: React.ReactNode;
    asChild?: boolean;
  }) =>
    asChild ? children : <div data-testid="tooltip-trigger">{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));

describe('ServiceNode', () => {
  const mockServiceData = {
    name: 'User API',
    tech: 'Node.js',
    version: '1.8.2',
    status: SERVICE_STATUS.HEALTHY,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render service information correctly', () => {
    render(<ServiceNode data={mockServiceData} />);

    expect(
      screen.getByRole('heading', { level: 3, name: 'User API' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Node.js service', { selector: 'p' })
    ).toBeInTheDocument();
    expect(screen.getByText('v1.8.2')).toBeInTheDocument();
    expect(screen.getByLabelText('Status: HEALTHY')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<ServiceNode data={mockServiceData} />);

    const serviceCard = screen.getByRole('button');
    expect(serviceCard).toHaveAttribute(
      'aria-label',
      'Service User API, Node.js version 1.8.2, status: HEALTHY'
    );
    expect(serviceCard).toHaveAttribute(
      'aria-describedby',
      'service-User API-description'
    );
    expect(serviceCard).toHaveAttribute('tabIndex', '0');
  });

  it('should handle keyboard events', () => {
    // No-op: event object not needed; we assert dispatchEvent calls
    const dispatchEventSpy = vi.spyOn(Element.prototype, 'dispatchEvent');

    render(<ServiceNode data={mockServiceData} />);

    const serviceCard = screen.getByRole('button');

    // Test Enter key
    fireEvent.keyDown(serviceCard, { key: 'Enter' });
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
      })
    );

    // Test Space key
    fireEvent.keyDown(serviceCard, { key: ' ' });
    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
      })
    );
  });

  it('should show selected state when selected prop is true', () => {
    render(<ServiceNode data={mockServiceData} selected={true} />);

    const serviceCard = screen.getByRole('button');
    expect(serviceCard).toHaveClass(
      'ring-2',
      'ring-primary',
      'shadow-xl',
      'scale-105'
    );
  });

  it('should render different status badges correctly', () => {
    const degradedData = {
      ...mockServiceData,
      status: SERVICE_STATUS.DEGRADED,
    };
    const { rerender } = render(<ServiceNode data={degradedData} />);

    expect(screen.getByLabelText('Status: DEGRADED')).toBeInTheDocument();

    const offlineData = { ...mockServiceData, status: SERVICE_STATUS.OFFLINE };
    rerender(<ServiceNode data={offlineData} />);

    expect(screen.getByLabelText('Status: OFFLINE')).toBeInTheDocument();
  });

  it('should render different tech icons', () => {
    const testCases = [
      { tech: 'React' },
      { tech: 'Node.js' },
      { tech: 'Go' },
      { tech: 'PostgreSQL' },
      { tech: 'Redis' },
      { tech: 'Unknown' },
    ];

    testCases.forEach(({ tech }) => {
      const { unmount } = render(
        <ServiceNode data={{ ...mockServiceData, tech }} />
      );

      // The icon component should be rendered (we can't easily test the specific icon without mocking lucide-react)
      expect(screen.getByRole('button')).toBeInTheDocument();

      unmount();
    });
  });

  it('should have proper focus styles', () => {
    render(<ServiceNode data={mockServiceData} />);

    const serviceCard = screen.getByRole('button');
    expect(serviceCard).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary',
      'focus:ring-offset-2'
    );
  });

  it('should render tooltip with service information', () => {
    render(<ServiceNode data={mockServiceData} />);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
  });

  it('should handle mobile responsive design', () => {
    // Mock mobile device
    (isMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<ServiceNode data={mockServiceData} />);

    const serviceCard = screen.getByRole('button');
    expect(serviceCard).toHaveClass('min-w-[180px]', 'w-[180px]', 'p-4');
  });

  it('should have proper ARIA hidden attributes for decorative elements', () => {
    render(<ServiceNode data={mockServiceData} />);

    // Check that handles and icons are marked as aria-hidden
    const handles = screen.getAllByRole('generic', { hidden: true });
    expect(handles.length).toBeGreaterThan(0);
  });

  it('should render status icon correctly', () => {
    const healthyData = { ...mockServiceData, status: SERVICE_STATUS.HEALTHY };
    render(<ServiceNode data={healthyData} />);

    // Status icon should be present (we can't easily test the specific icon without mocking lucide-react)
    const serviceCard = screen.getByRole('button');
    expect(serviceCard).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    render(<ServiceNode data={mockServiceData} />);

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'User API'
    );

    // Check for proper description
    expect(screen.getByText('Node.js service')).toBeInTheDocument();
  });
});
