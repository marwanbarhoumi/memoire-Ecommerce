export function logError(error, errorInfo) {
    // Stockage local (développement)
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error:', error, errorInfo);
      return;
    }
    
    // Envoi à votre backend en prod
    const errorData = {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      user: localStorage.getItem('userId')
    };
  
    navigator.sendBeacon('/api/log-error', JSON.stringify(errorData));
  }