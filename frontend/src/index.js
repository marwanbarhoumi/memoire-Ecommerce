import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { store } from "./JS/store";

// ======================================
// 1. CONFIGURATION DE SURVEILLANCE (SENTRY)
// ======================================
if (process.env.REACT_APP_SENTRY_DSN) {
  import('@sentry/browser').then((Sentry) => {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new Sentry.BrowserTracing()],
      tracesSampleRate: 0.2,
      environment: process.env.NODE_ENV,
      release: process.env.REACT_APP_VERSION,
    });
  }).catch(() => {
    console.warn('Sentry initialization failed');
  });
}

// ======================================
// 2. CONFIGURATION DES MÉTRIQUES
// ======================================
const metricsEnabled = process.env.NODE_ENV === 'production' 
  && process.env.REACT_APP_METRICS_ENABLED === 'true';

let pageLoadTime;
if (metricsEnabled) {
  import('prom-client').then(({ Gauge, collectDefaultMetrics }) => {
    collectDefaultMetrics();
    pageLoadTime = new Gauge({
      name: 'frontend_page_load_time_seconds',
      help: 'Temps de chargement des pages en secondes',
      labelNames: ['page_name']
    });
  }).catch(() => {
    console.warn('Prometheus client failed to load');
  });
}

// ======================================
// 3. FONCTION DE RAPPORT DES PERFORMANCES
// ======================================
function handleWebVitals(metric) {
  if (metricsEnabled && pageLoadTime) {
    pageLoadTime.set(
      { page_name: window.location.pathname }, 
      metric.value / 1000 // Conversion ms -> secondes
    );
  }
  
  // Envoyer également à la console en développement
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[WebVitals]', metric);
  }
}

// ======================================
// 4. RENDU DE L'APPLICATION
// ======================================
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// ======================================
// 5. ACTIVATION DU MONITORING
// ======================================
reportWebVitals(handleWebVitals);