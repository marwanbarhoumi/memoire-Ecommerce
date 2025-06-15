import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://192.168.49.2:31520', 'http://localhost'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

// Middleware pour parser le JSON
app.use(express.json());

// Route de santé
app.get('/gateway-status', (req, res) => {
  res.json({ 
    status: 'OK',
    services: {
      auth: 'http://login-service:80',
      products: 'http://product-service:80',
      users: 'http://user-service:80'
    }
  });
});

// Configuration des proxies
const proxyOptions = {
  logLevel: 'debug',
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    console.log(`Proxying ${req.method} request to: ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Gateway proxy error' });
  }
};

// Proxy pour l'authentification
app.use('/api/auth', createProxyMiddleware({
  ...proxyOptions,
  target: 'http://login-service:80',
  pathRewrite: { '^/api/auth': '' }
}));

// Proxy pour les produits
app.use('/api/products', createProxyMiddleware({
  ...proxyOptions,
  target: 'http://product-service:80',
  pathRewrite: { '^/api/products': '' }
}));

// Proxy pour les utilisateurs
app.use('/api/user', createProxyMiddleware({
  ...proxyOptions,
  target: 'http://user-service:80',
  pathRewrite: { '^/api/user': '' }
}));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Gateway error:', err.stack);
  res.status(500).json({ error: 'Internal Gateway Error' });
});

app.listen(7000, '0.0.0.0', () => {
  console.log('🚀 Gateway démarré sur port 7000');
  console.log('Routes configurées:');
  console.log('- /api/auth -> login-service');
  console.log('- /api/products -> product-service');
  console.log('- /api/user -> user-service');
});