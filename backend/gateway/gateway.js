import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Configuration CORS pour Kubernetes
const CORS_ORIGINS = [
  'http://frontend-service.memoire-ecommerce.svc.cluster.local',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration des services
const SERVICES = {
  AUTH: {
    url: process.env.LOGIN_SERVICE_URL || 'http://login-service.memoire-ecommerce.svc.cluster.local:80',
    path: '/api/auth'
  },
  PRODUCT: {
    url: process.env.PRODUCT_SERVICE_URL || 'http://product-service.memoire-ecommerce.svc.cluster.local:80',
    path: '/api/products'
  },
  USER: {
    url: process.env.USER_SERVICE_URL || 'http://user-service.memoire-ecommerce.svc.cluster.local:80',
    path: '/api/user'
  }
};

// Health Check Endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: Object.keys(SERVICES).reduce((acc, key) => {
      acc[key.toLowerCase()] = SERVICES[key].url;
      return acc;
    }, {})
  });
});

// Proxy Middleware Configuration
const createServiceProxy = (service) => {
  return createProxyMiddleware({
    target: service.url,
    pathRewrite: { [`^${service.path}`]: '' },
    logLevel: 'info',
    changeOrigin: true,
    secure: false,
    timeout: 10000,
    onProxyReq: (proxyReq) => {
      console.log(`[Gateway] Routing to ${service.url}: ${proxyReq.method} ${proxyReq.path}`);
    },
    onError: (err, req, res) => {
      console.error(`[Gateway Error] ${service.url}:`, err);
      res.status(502).json({ 
        error: 'Service Unavailable',
        service: service.url.replace('.svc.cluster.local', ''),
        timestamp: new Date().toISOString()
      });
    }
  });
};

// Setup Proxies
Object.values(SERVICES).forEach(service => {
  app.use(service.path, createServiceProxy(service));
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('[Gateway Error]', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    requestId: req.id,
    timestamp: new Date().toISOString()
  });
});

// Server Startup
const PORT = process.env.PORT || 7000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Gateway running on port ${PORT}`);
  console.log('Configured routes:');
  Object.entries(SERVICES).forEach(([name, config]) => {
    console.log(`- ${config.path} -> ${config.url}`);
  });
});