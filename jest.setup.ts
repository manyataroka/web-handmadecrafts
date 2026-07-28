import '@testing-library/jest-dom';

// Provide simple mocks for window.location modifications used in components
Object.defineProperty(window, 'location', {
  value: {
    href: '/',
  },
  writable: true,
});
