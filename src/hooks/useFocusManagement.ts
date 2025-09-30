import { useEffect, useRef, useCallback } from 'react';

interface FocusManagementOptions {
  trapFocus?: boolean;
  restoreFocus?: boolean;
  initialFocus?: boolean;
}

export function useFocusManagement(options: FocusManagementOptions = {}) {
  const {
    trapFocus = false,
    restoreFocus = false,
    initialFocus = false,
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // Store the previously focused element when component mounts
  useEffect(() => {
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement;
    }
  }, [restoreFocus]);

  // Focus the container on mount if initialFocus is true
  useEffect(() => {
    if (initialFocus && containerRef.current) {
      containerRef.current.focus();
    }
  }, [initialFocus]);

  // Restore focus when component unmounts
  useEffect(() => {
    return () => {
      if (
        restoreFocus &&
        previousActiveElement.current instanceof HTMLElement
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [restoreFocus]);

  // Handle focus trapping
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!trapFocus || !containerRef.current) return;

      if (event.key === 'Tab') {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement?.focus();
          }
        }
      }

      if (event.key === 'Escape') {
        // Allow escape to close modal/panel
        const escapeEvent = new CustomEvent('escape-key');
        containerRef.current.dispatchEvent(escapeEvent);
      }
    },
    [trapFocus]
  );

  useEffect(() => {
    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [trapFocus, handleKeyDown]);

  return {
    containerRef,
    handleKeyDown,
  };
}

// Hook for managing focus in React Flow nodes
export function useNodeFocusManagement() {
  const nodeRef = useRef<HTMLDivElement>(null);

  const focusNode = useCallback(() => {
    if (nodeRef.current) {
      nodeRef.current.focus();
    }
  }, []);

  const blurNode = useCallback(() => {
    if (nodeRef.current) {
      nodeRef.current.blur();
    }
  }, []);

  return {
    nodeRef,
    focusNode,
    blurNode,
  };
}

// Hook for managing focus in panels and modals
export function usePanelFocusManagement(isOpen: boolean) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      // Focus the panel when it opens
      panelRef.current.focus();
    }
  }, [isOpen]);

  return {
    panelRef,
  };
}
