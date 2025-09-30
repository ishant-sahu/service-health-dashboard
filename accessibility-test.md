# Accessibility Testing Guide

This document provides a comprehensive guide for testing the accessibility features implemented in the Service Health Dashboard.

## Automated Testing

### 1. ESLint Accessibility Plugin

The project already includes `eslint-plugin-jsx-a11y` which provides automated accessibility linting.

```bash
npm run lint
```

### 2. Browser Developer Tools

- **Chrome DevTools**: Use the Lighthouse audit for accessibility
- **Firefox DevTools**: Use the Accessibility panel
- **Safari Web Inspector**: Use the Accessibility tab

### 3. Browser Extensions

- **axe DevTools**: Comprehensive accessibility testing
- **WAVE**: Web Accessibility Evaluation Tool
- **Lighthouse**: Built into Chrome DevTools

## Manual Testing Checklist

### Keyboard Navigation

- [ ] Tab through all interactive elements
- [ ] Use Enter/Space to activate buttons and cards
- [ ] Use Escape to close panels
- [ ] Verify focus indicators are visible
- [ ] Test focus trapping in panels

### Screen Reader Testing

- [ ] Test with NVDA (Windows)
- [ ] Test with JAWS (Windows)
- [ ] Test with VoiceOver (macOS)
- [ ] Test with Orca (Linux)
- [ ] Verify all content is announced
- [ ] Check for proper heading structure
- [ ] Verify ARIA labels and descriptions

### Visual Testing

- [ ] Test with high contrast mode
- [ ] Test with reduced motion preferences
- [ ] Verify color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- [ ] Test with different zoom levels (up to 200%)

### Mobile Accessibility

- [ ] Test touch targets (minimum 44x44px)
- [ ] Verify responsive design works with screen readers
- [ ] Test with mobile screen readers

## Specific Features to Test

### Service Nodes

- [ ] Keyboard navigation to service cards
- [ ] Screen reader announces service details
- [ ] Focus indicators are visible
- [ ] Status changes are announced

### Dashboard Header

- [ ] Statistics are announced to screen readers
- [ ] Theme toggle is accessible
- [ ] Panel toggle is accessible

### Details Panel

- [ ] Panel opens/closes with keyboard
- [ ] Focus management works correctly
- [ ] Metrics are announced
- [ ] Escape key closes panel

### Real-time Updates

- [ ] Status changes are announced
- [ ] Metrics updates are announced
- [ ] Dashboard statistics are announced

## Color Contrast Testing

### Required Ratios

- **Normal text**: 4.5:1 contrast ratio
- **Large text (18pt+)**: 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio

### Tools for Testing

- WebAIM Contrast Checker
- Colour Contrast Analyser
- Browser DevTools

## Testing Tools Installation

### Browser Extensions

```bash
# Install axe DevTools extension
# Available for Chrome, Firefox, Edge

# Install WAVE extension
# Available for Chrome, Firefox
```

### Command Line Tools

```bash
# Install axe-core CLI
npm install -g @axe-core/cli

# Run accessibility tests
axe https://localhost:3000
```

## Common Issues to Check

### ARIA Issues

- [ ] Missing or incorrect ARIA labels
- [ ] Orphaned ARIA labels
- [ ] Incorrect ARIA roles
- [ ] Missing ARIA descriptions

### Keyboard Issues

- [ ] Missing tabindex attributes
- [ ] Incorrect tab order
- [ ] Missing keyboard event handlers
- [ ] Focus not visible

### Screen Reader Issues

- [ ] Missing alt text for images
- [ ] Missing headings
- [ ] Incorrect heading hierarchy
- [ ] Missing landmarks

## Performance Considerations

### Accessibility Performance

- [ ] Screen reader announcements don't cause performance issues
- [ ] Focus management doesn't impact rendering
- [ ] ARIA updates are efficient

## Reporting Issues

When reporting accessibility issues, include:

1. **Issue description**: What's not working
2. **Steps to reproduce**: How to trigger the issue
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Assistive technology used**: Screen reader, browser, OS
6. **Severity**: Critical, High, Medium, Low

## Resources

- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)
- [axe-core Documentation](https://github.com/dequelabs/axe-core)
