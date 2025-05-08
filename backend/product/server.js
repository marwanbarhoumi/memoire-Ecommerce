const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/DB");
const productRouter = require("./routes/productRoutes");

function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

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

  // Error handling
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
  const PORT = process.env.PRODUCT_PORT || 7003;
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