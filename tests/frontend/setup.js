// Frontend test setup
// This runs before each test suite to configure the jsdom environment

// Mock missing DOM APIs that jsdom doesn't provide
if (typeof window !== 'undefined') {
  // Used by Element UI
  window.matchMedia =
    window.matchMedia ||
    (() => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));

  // Mock scrollTo
  window.scrollTo = window.scrollTo || (() => {});
}
