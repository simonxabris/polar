const defaults = {
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  FRONTEND_BASE_URL:
    import.meta.env.VITE_FRONTEND_BASE_URL || 'http://127.0.0.1:3000',
  BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  AUTH_COOKIE_KEY: 'polar_session',
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || undefined,
  POSTHOG_TOKEN: import.meta.env.VITE_POSTHOG_TOKEN || '',
  SANDBOX_FRONTEND_BASE_URL:
    import.meta.env.VITE_SANDBOX_FRONTEND_BASE_URL || 'http://127.0.0.1:3000',
}

export const CONFIG = {
  ...defaults,
  IS_SANDBOX: defaults.ENVIRONMENT === 'sandbox',
}
