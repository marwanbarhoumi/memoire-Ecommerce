import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ],
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0.1,
    environment: process.env.REACT_APP_ENV
  });
};