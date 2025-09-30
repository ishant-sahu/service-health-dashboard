import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isMobile, isTablet, getLayoutConstants } from '../../utils/responsive';

describe('Responsive Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isMobile', () => {
    it('should return true for mobile screen widths', () => {
      expect(isMobile(320)).toBe(true);
      expect(isMobile(375)).toBe(true);
      expect(isMobile(414)).toBe(true);
      expect(isMobile(767)).toBe(true);
    });

    it('should return false for tablet and desktop screen widths', () => {
      expect(isMobile(768)).toBe(false);
      expect(isMobile(1024)).toBe(false);
      expect(isMobile(1440)).toBe(false);
    });

    it('should handle edge case at boundary', () => {
      expect(isMobile(767)).toBe(true);
      expect(isMobile(768)).toBe(false);
    });
  });

  describe('isTablet', () => {
    it('should return true for tablet screen widths', () => {
      expect(isTablet(768)).toBe(true);
      expect(isTablet(1023)).toBe(true);
      expect(isTablet(1024)).toBe(true);
    });

    it('should return false for mobile and desktop screen widths', () => {
      expect(isTablet(767)).toBe(false);
      expect(isTablet(1025)).toBe(false);
      expect(isTablet(1440)).toBe(false);
    });

    it('should handle edge case at boundary', () => {
      expect(isTablet(1023)).toBe(true);
      expect(isTablet(1024)).toBe(true);
    });
  });

  describe('getLayoutConstants', () => {
    it('should return mobile constants for mobile widths', () => {
      const mobileConstants = getLayoutConstants(375);

      expect(mobileConstants.COLS_PER_ROW).toBe(2);
      expect(mobileConstants.SERVICE_WIDTH).toBeDefined();
      expect(mobileConstants.SERVICE_HEIGHT).toBeDefined();
      expect(mobileConstants.CONTAINER_PADDING).toBeDefined();
      expect(mobileConstants.HEADER_HEIGHT).toBeDefined();
    });

    it('should return tablet constants for tablet widths', () => {
      const tabletConstants = getLayoutConstants(768);

      expect(tabletConstants.COLS_PER_ROW).toBe(2);
      expect(tabletConstants.SERVICE_WIDTH).toBeDefined();
      expect(tabletConstants.SERVICE_HEIGHT).toBeDefined();
      expect(tabletConstants.CONTAINER_PADDING).toBeDefined();
      expect(tabletConstants.HEADER_HEIGHT).toBeDefined();
    });

    it('should return desktop constants for desktop widths', () => {
      const desktopConstants = getLayoutConstants(1024);

      expect(desktopConstants.COLS_PER_ROW).toBe(3);
      expect(desktopConstants.SERVICE_WIDTH).toBeDefined();
      expect(desktopConstants.SERVICE_HEIGHT).toBeDefined();
      expect(desktopConstants.CONTAINER_PADDING).toBeDefined();
      expect(desktopConstants.HEADER_HEIGHT).toBeDefined();
    });

    it('should return consistent constants for same screen size', () => {
      const constants1 = getLayoutConstants(768);
      const constants2 = getLayoutConstants(768);

      expect(constants1).toEqual(constants2);
    });

    it('should have valid numeric values', () => {
      const constants = getLayoutConstants(1024);

      expect(typeof constants.COLS_PER_ROW).toBe('number');
      expect(typeof constants.SERVICE_WIDTH).toBe('number');
      expect(typeof constants.SERVICE_HEIGHT).toBe('number');
      expect(typeof constants.CONTAINER_PADDING).toBe('number');
      expect(typeof constants.HEADER_HEIGHT).toBe('number');
      expect(typeof constants.SPACING_BETWEEN_SERVICES).toBe('number');
      expect(typeof constants.SPACING_BETWEEN_ROWS).toBe('number');
    });

    it('should have positive values', () => {
      const constants = getLayoutConstants(1024);

      expect(constants.COLS_PER_ROW).toBeGreaterThan(0);
      expect(constants.SERVICE_WIDTH).toBeGreaterThan(0);
      expect(constants.SERVICE_HEIGHT).toBeGreaterThan(0);
      expect(constants.CONTAINER_PADDING).toBeGreaterThanOrEqual(0);
      expect(constants.HEADER_HEIGHT).toBeGreaterThan(0);
      expect(constants.SPACING_BETWEEN_SERVICES).toBeGreaterThanOrEqual(0);
      expect(constants.SPACING_BETWEEN_ROWS).toBeGreaterThanOrEqual(0);
    });

    it('should handle edge cases', () => {
      expect(() => getLayoutConstants(0)).not.toThrow();
      expect(() => getLayoutConstants(-100)).not.toThrow();
      expect(() => getLayoutConstants(10000)).not.toThrow();
    });

    it('should return different constants for different screen sizes', () => {
      const mobileConstants = getLayoutConstants(375);
      const tabletConstants = getLayoutConstants(768);
      const desktopConstants = getLayoutConstants(1024);

      expect(mobileConstants).not.toEqual(tabletConstants);
      expect(tabletConstants).not.toEqual(desktopConstants);
      expect(mobileConstants).not.toEqual(desktopConstants);
    });

    it('should have appropriate column counts for each device type', () => {
      const mobileConstants = getLayoutConstants(375);
      const tabletConstants = getLayoutConstants(768);
      const desktopConstants = getLayoutConstants(1024);

      expect(mobileConstants.COLS_PER_ROW).toBeLessThanOrEqual(
        tabletConstants.COLS_PER_ROW
      );
      expect(tabletConstants.COLS_PER_ROW).toBeLessThanOrEqual(
        desktopConstants.COLS_PER_ROW
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero width', () => {
      expect(isMobile(0)).toBe(true);
      expect(isTablet(0)).toBe(false);
      expect(() => getLayoutConstants(0)).not.toThrow();
    });

    it('should handle negative width', () => {
      expect(isMobile(-100)).toBe(true);
      expect(isTablet(-100)).toBe(false);
      expect(() => getLayoutConstants(-100)).not.toThrow();
    });

    it('should handle very large width', () => {
      expect(isMobile(10000)).toBe(false);
      expect(isTablet(10000)).toBe(false);
      expect(() => getLayoutConstants(10000)).not.toThrow();
    });

    it('should handle decimal widths', () => {
      expect(isMobile(375.5)).toBe(true);
      expect(isTablet(768.7)).toBe(true);
      expect(() => getLayoutConstants(1024.3)).not.toThrow();
    });
  });

  describe('Consistency', () => {
    it('should maintain consistent behavior across multiple calls', () => {
      const width = 768;

      expect(isMobile(width)).toBe(isMobile(width));
      expect(isTablet(width)).toBe(isTablet(width));
      expect(getLayoutConstants(width)).toEqual(getLayoutConstants(width));
    });

    it('should handle rapid successive calls', () => {
      const widths = [320, 375, 768, 1024, 1440];

      widths.forEach((width) => {
        expect(() => {
          isMobile(width);
          isTablet(width);
          getLayoutConstants(width);
        }).not.toThrow();
      });
    });
  });
});
