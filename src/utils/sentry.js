/**
 * Sentry Error Tracking Configuration (Vue 2)
 *
 * Call initSentry() AFTER the Vue instance is created (window.vm is set).
 *
 * Usage:
 *   import { initSentry } from './utils/sentry';
 *   // ... create Vue instance ...
 *   initSentry();
 */

const SENTRY_DSN = process.env.VUE_APP_SENTRY_DSN;

/**
 * Initialize Sentry error tracking.
 * Must be called after window.vm (Vue instance) is created.
 */
export function initSentry() {
  if (!SENTRY_DSN || !window.vm) {
    return;
  }

  // Dynamic import so @sentry/vue is optional — no build failure if not installed
  import('@sentry/vue').then((Sentry) => {
    try {
      Sentry.init({
        app: window.vm,
        dsn: SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        integrations: [
          Sentry.browserTracingIntegration?.({
            router: window.vm?.$router,
          }),
          Sentry.replayIntegration?.(),
        ].filter(Boolean),
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });
      console.log('[Sentry] Error tracking initialized');
    } catch (err) {
      console.warn('[Sentry] Initialization failed:', err.message);
    }
  }).catch(() => {
    // @sentry/vue not installed — silent skip
  });
}
