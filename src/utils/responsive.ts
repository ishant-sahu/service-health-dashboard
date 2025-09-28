import { LAYOUT_CONSTANTS } from '../constants/dashboard';

/**
 * Utility functions for responsive design breakpoints
 */

/**
 * Check if the current window width is mobile size
 * @param windowWidth - The current window width
 * @returns true if the window width is below the mobile breakpoint
 */
export const isMobile = (windowWidth: number): boolean => {
  return windowWidth < LAYOUT_CONSTANTS.BREAKPOINTS.MOBILE;
};

/**
 * Check if the current window width is tablet size
 * @param windowWidth - The current window width
 * @returns true if the window width is between mobile and tablet breakpoints
 */
export const isTablet = (windowWidth: number): boolean => {
  return (
    windowWidth >= LAYOUT_CONSTANTS.BREAKPOINTS.MOBILE &&
    windowWidth < LAYOUT_CONSTANTS.BREAKPOINTS.TABLET
  );
};

/**
 * Check if the current window width is desktop size
 * @param windowWidth - The current window width
 * @returns true if the window width is above the tablet breakpoint
 */
export const isDesktop = (windowWidth: number): boolean => {
  return windowWidth >= LAYOUT_CONSTANTS.BREAKPOINTS.TABLET;
};

/**
 * Get the current device type based on window width
 * @param windowWidth - The current window width
 * @returns 'mobile' | 'tablet' | 'desktop'
 */
export const getDeviceType = (
  windowWidth: number
): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobile(windowWidth)) return 'mobile';
  if (isTablet(windowWidth)) return 'tablet';
  return 'desktop';
};

/**
 * Get the appropriate layout constants based on window width
 * @param windowWidth - The current window width
 * @returns The layout constants for the current device type
 */
export const getLayoutConstants = (windowWidth: number) => {
  if (isMobile(windowWidth)) return LAYOUT_CONSTANTS.MOBILE;
  if (isTablet(windowWidth)) return LAYOUT_CONSTANTS.TABLET;
  return LAYOUT_CONSTANTS.DESKTOP;
};
