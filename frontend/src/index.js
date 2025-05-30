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
// 2. FONCTION DE RAPPORT DES PERFORMANCES
// ======================================
function handleWebVitals(metric) {
  // Envoie les métriques au backend si activé
  const metricsEnabled = process.env.NODE_ENV === 'production'
    && process.env.REACT_APP_METRICS_ENABLED === 'true';

  if (metricsEnabled) {
    fetch("/api/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        page: window.location.pathname,
      }),
    }).catch(() => {
      console.warn("Échec de l'envoi des métriques");
    });
  }

  // Console debug en dev
  if (process.env.NODE_ENV !== 'production') {
    console.debug('[WebVitals]', metric);
  }
}

// ======================================
// 3. RENDU DE L'APPLICATION
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
// 4. ACTIVATION DU MONITORING
// ======================================
reportWebVitals(handleWebVitals);
