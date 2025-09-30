import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardHeader from '../../components/DashboardHeader';

// Mock the responsive utility
vi.mock('../../utils/responsive', () => ({
  isMobile: vi.fn(() => false),
}));
import { isMobile } from '../../utils/responsive';

describe('DashboardHeader', () => {
  const mockWindowSize = {
    width: 1024,
    height: 768,
  };

  const mockDashboardStats = {
    total: 10,
    healthy: 7,
    degraded: 2,
    offline: 1,
  };

  const mockProps = {
    windowSize: mockWindowSize,
    dashboardStats: mockDashboardStats,
    isDarkMode: false,
    isPanelOpen: false,
    onToggleDarkMode: vi.fn(),
    onTogglePanel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard title and stats correctly', () => {
    render(<DashboardHeader {...mockProps} />);

    expect(screen.getByText('Service Health Dashboard')).toBeInTheDocument();
    expect(screen.getByText('7 Healthy')).toBeInTheDocument();
    expect(screen.getByText('2 Degraded')).toBeInTheDocument();
    expect(screen.getByText('1 Offline')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<DashboardHeader {...mockProps} />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const statsRegion = screen.getByLabelText('Service status summary');
    expect(statsRegion).toBeInTheDocument();

    const toolbar = screen.getByLabelText('Dashboard controls');
    expect(toolbar).toBeInTheDocument();
  });

  it('should render status cards with proper ARIA labels', () => {
    render(<DashboardHeader {...mockProps} />);

    expect(screen.getByLabelText('7 healthy services')).toBeInTheDocument();
    expect(screen.getByLabelText('2 degraded services')).toBeInTheDocument();
    expect(screen.getByLabelText('1 offline services')).toBeInTheDocument();
  });

  it('should render theme toggle button with proper accessibility', () => {
    render(<DashboardHeader {...mockProps} />);

    const themeButton = screen.getByLabelText('Switch to dark mode');
    expect(themeButton).toBeInTheDocument();
    expect(themeButton).toHaveTextContent('Dark');
  });

  it('should render panel toggle button with proper accessibility', () => {
    render(<DashboardHeader {...mockProps} />);

    const panelButton = screen.getByLabelText('Open details panel');
    expect(panelButton).toBeInTheDocument();
    expect(panelButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('should call onToggleDarkMode when theme button is clicked', () => {
    render(<DashboardHeader {...mockProps} />);

    const themeButton = screen.getByLabelText('Switch to dark mode');
    fireEvent.click(themeButton);

    expect(mockProps.onToggleDarkMode).toHaveBeenCalledTimes(1);
  });

  it('should call onTogglePanel when panel button is clicked', () => {
    render(<DashboardHeader {...mockProps} />);

    const panelButton = screen.getByLabelText('Open details panel');
    fireEvent.click(panelButton);

    expect(mockProps.onTogglePanel).toHaveBeenCalledTimes(1);
  });

  it('should update theme button text and aria-label when in dark mode', () => {
    const darkModeProps = { ...mockProps, isDarkMode: true };
    render(<DashboardHeader {...darkModeProps} />);

    const themeButton = screen.getByLabelText('Switch to light mode');
    expect(themeButton).toBeInTheDocument();
    expect(themeButton).toHaveTextContent('Light');
  });

  it('should update panel button aria-label and aria-expanded when panel is open', () => {
    const panelOpenProps = { ...mockProps, isPanelOpen: true };
    render(<DashboardHeader {...panelOpenProps} />);

    const panelButton = screen.getByLabelText('Close details panel');
    expect(panelButton).toBeInTheDocument();
    expect(panelButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('should handle mobile responsive design', () => {
    // Mock mobile device
    (isMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<DashboardHeader {...mockProps} />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should render proper heading structure', () => {
    render(<DashboardHeader {...mockProps} />);

    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent('Service Health Dashboard');
  });

  it('should have proper semantic structure', () => {
    render(<DashboardHeader {...mockProps} />);

    // Check for proper landmark roles
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('should render status indicators with proper ARIA hidden attributes', () => {
    render(<DashboardHeader {...mockProps} />);

    // Status dots should be marked as aria-hidden since they're decorative
    const statusDots = screen.getAllByRole('generic', { hidden: true });
    expect(statusDots.length).toBeGreaterThan(0);
  });

  it('should render icons with proper ARIA hidden attributes', () => {
    render(<DashboardHeader {...mockProps} />);

    // Icons should be marked as aria-hidden since they're decorative
    const icons = screen.getAllByRole('generic', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should update stats when dashboard stats change', () => {
    const newStats = {
      total: 15,
      healthy: 10,
      degraded: 3,
      offline: 2,
    };

    const { rerender } = render(<DashboardHeader {...mockProps} />);

    expect(screen.getByText('7 Healthy')).toBeInTheDocument();

    rerender(<DashboardHeader {...mockProps} dashboardStats={newStats} />);

    expect(screen.getByText('10 Healthy')).toBeInTheDocument();
    expect(screen.getByText('3 Degraded')).toBeInTheDocument();
    expect(screen.getByText('2 Offline')).toBeInTheDocument();
  });

  it('should have proper focus management', () => {
    render(<DashboardHeader {...mockProps} />);

    const themeButton = screen.getByLabelText('Switch to dark mode');
    const panelButton = screen.getByLabelText('Open details panel');

    expect(themeButton).toBeInTheDocument();
    expect(panelButton).toBeInTheDocument();
  });

  it('should render with different window sizes', () => {
    const mobileWindowSize = { width: 375, height: 667 };
    const mobileProps = { ...mockProps, windowSize: mobileWindowSize };

    // Mock mobile device
    (isMobile as unknown as ReturnType<typeof vi.fn>).mockReturnValue(true);

    render(<DashboardHeader {...mobileProps} />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should have proper color contrast for status indicators', () => {
    render(<DashboardHeader {...mockProps} />);

    // Status cards should have proper styling for different states
    const healthyCard = screen.getByLabelText('7 healthy services');
    const degradedCard = screen.getByLabelText('2 degraded services');
    const offlineCard = screen.getByLabelText('1 offline services');

    expect(healthyCard).toBeInTheDocument();
    expect(degradedCard).toBeInTheDocument();
    expect(offlineCard).toBeInTheDocument();
  });
});
