// error-boundary.jsx
import { ErrorBoundary } from 'react-error-boundary';

export const CustomErrorBoundary = ({ children }) => (
  <ErrorBoundary
    onError={(error, info) => {
      Sentry.captureException(error, { extra: info });
    }}
    fallback={<ErrorScreen />}
  >
    {children}
  </ErrorBoundary>
);