import { useCallback } from 'react';

interface AnnouncementOptions {
  priority?: 'polite' | 'assertive';
  delay?: number;
}

export function useScreenReaderAnnouncements() {
  const announce = useCallback(
    (message: string, options: AnnouncementOptions = {}) => {
      const { priority = 'polite', delay = 0 } = options;

      setTimeout(() => {
        // Create a live region element for announcements
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only'; // Screen reader only class
        announcement.textContent = message;

        // Add to DOM temporarily
        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      }, delay);
    },
    []
  );

  const announceServiceStatusChange = useCallback(
    (serviceName: string, oldStatus: string, newStatus: string) => {
      announce(
        `Service ${serviceName} status changed from ${oldStatus} to ${newStatus}`,
        { priority: 'assertive' }
      );
    },
    [announce]
  );

  const announceConnectionStatusChange = useCallback(
    (source: string, target: string, oldStatus: string, newStatus: string) => {
      announce(
        `Connection from ${source} to ${target} status changed from ${oldStatus} to ${newStatus}`,
        { priority: 'assertive' }
      );
    },
    [announce]
  );

  const announcePanelOpen = useCallback(
    (itemType: 'service' | 'connection', itemName: string) => {
      announce(`${itemType} details panel opened for ${itemName}`, {
        priority: 'polite',
      });
    },
    [announce]
  );

  const announcePanelClose = useCallback(() => {
    announce('Details panel closed', { priority: 'polite' });
  }, [announce]);

  const announceMetricsUpdate = useCallback(
    (rps: number, latency: number, errorRate: number) => {
      announce(
        `Metrics updated: ${rps} requests per second, ${latency} milliseconds latency, ${errorRate.toFixed(
          2
        )} percent error rate`,
        { priority: 'polite' }
      );
    },
    [announce]
  );

  const announceDashboardStats = useCallback(
    (total: number, healthy: number, degraded: number, offline: number) => {
      announce(
        `Dashboard summary: ${total} total services, ${healthy} healthy, ${degraded} degraded, ${offline} offline`,
        { priority: 'polite' }
      );
    },
    [announce]
  );

  return {
    announce,
    announceServiceStatusChange,
    announceConnectionStatusChange,
    announcePanelOpen,
    announcePanelClose,
    announceMetricsUpdate,
    announceDashboardStats,
  };
}

// Hook for managing live regions
export function useLiveRegion() {
  const createLiveRegion = useCallback(
    (id: string, priority: 'polite' | 'assertive' = 'polite') => {
      // Remove existing live region if it exists
      const existing = document.getElementById(id);
      if (existing) {
        existing.remove();
      }

      // Create new live region
      const liveRegion = document.createElement('div');
      liveRegion.id = id;
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.textContent = '';

      document.body.appendChild(liveRegion);
      return liveRegion;
    },
    []
  );

  const updateLiveRegion = useCallback((id: string, message: string) => {
    const liveRegion = document.getElementById(id);
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, []);

  const removeLiveRegion = useCallback((id: string) => {
    const liveRegion = document.getElementById(id);
    if (liveRegion) {
      liveRegion.remove();
    }
  }, []);

  return {
    createLiveRegion,
    updateLiveRegion,
    removeLiveRegion,
  };
}
