const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/DB");
const productRouter = require("./routes/productRoutes");
const client = require('prom-client');
const register = new client.Registry();

client.collectDefaultMetrics({ register });


function createServer() {
  const app = express();
  const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Nombre total de requêtes HTTP',
    labelNames: ['method', 'route', 'status'],
  });
  register.registerMetric(httpRequestCounter)
  // Middleware
  app.use(cors());
  app.use(express.json());
  // Ajoutez ceci après la création de l'app Express
const promBundle = require("express-prom-bundle");
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  customLabels: { service: "product-service" },
  promRegistry: register
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});
  // Serve static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
  // Routes
  app.use("/api/products", productRouter);
  
  // Health check
  app.get("/api/products/health", (req, res) => {
    res.status(200).json({ 
      status: "OK", 
      service: "product-service",
      db: "connected",
      uploads: "enabled",
      timestamp: new Date().toISOString()
    });
  });

  // Error handlingf
  app.use((err, req, res, next) => {
    console.error("Erreur Produit:", err);
    res.status(500).json({ 
      error: "Erreur interne du serveur",
      message: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  });

  return app;
}

// Only connect DB and start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
  const PORT = process.env.PRODUCT_PORT || 7100;
  const server = createServer().listen(PORT, () => {
    console.log(`
    🚀 Service Produit démarré avec succès
    📌 Port: ${PORT}
    🌐 URL Base: http://localhost:${PORT}/api/products
    📁 Accès fichiers: http://localhost:${PORT}/uploads/
    ⏰ Démarrage: ${new Date().toLocaleTimeString()}
    `);
  });
}

module.exports = createServer;