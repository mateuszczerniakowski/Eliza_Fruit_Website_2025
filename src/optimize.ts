// Performance optimizations for production builds
export const OPTIMIZATION_CONFIG = {
  // Enable aggressive tree shaking
  sideEffects: false,
  
  // Preload critical resources
  preloadCritical: true,
  
  // Lazy load non-critical assets
  lazyLoadAssets: true,
  
  // Minimize bundle size
  minifyOutput: true,
  
  // Remove console logs in production
  removeConsole: true
};

// Remove console logs in production
if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
  console.log = console.warn = console.error = () => {};
}