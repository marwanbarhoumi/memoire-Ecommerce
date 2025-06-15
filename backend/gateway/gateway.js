import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors({
  origin: ['http://192.168.49.2:31520'], 
  credentials: true
}));

// Route de test
app.get('/gateway-status', (req, res) => {
  res.json({ status: 'OK', message: 'Gateway fonctionnel' });
});

// Proxy pour le microservice d'authentification
app.use('/api/auth', createProxyMiddleware({
  target: 'http://localhost:7002',  // Microservice d'authentification sur le port 7002
  changeOrigin: true
}));

// Proxy pour le microservice des produits
app.use('/api/products', createProxyMiddleware({
  target: 'http://localhost:7003',  // Microservice des produits sur le port 7003
  changeOrigin: true
}));

app.use('/api/user', createProxyMiddleware({
  target: 'http://localhost:7004',  // Microservice des user sur le port 7004
  changeOrigin: true
}));



app.listen(7000, '0.0.0.0', () => {
  console.log('🚀 Gateway démarré sur port 7000');
});
