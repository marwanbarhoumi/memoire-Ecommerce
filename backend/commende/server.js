require("dotenv").config({ path: "./config/.env" });
const passport = require("passport");
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/DB');
const commendeRoutes = require('./routes/commendeRoutes');
const authRoutes = require('../login/routes/authRoutes'); 
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

require("./middlewares/authorization/isAuth");

const app = express();

// Configuration CORS améliorée
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000','http://localhost:3002'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares de sécurité
app.use(helmet());
app.use(cors(corsOptions));

// Limiteur de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
});
app.use(limiter);

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialisation Passport
app.use(passport.initialize());

// Routes
app.use('/api', commendeRoutes);
app.use('/api/auth', authRoutes); // Routes d'authentification

// Route de test
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée'
  });
});

// Gestionnaire d'erreurs centralisé


// Connexion à la base de données
connectDB();

const PORT = process.env.PORT || 7005;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Gestion propre des erreurs non catchées
process.on('unhandledRejection', (err) => {
  console.error('Erreur non gérée:', err);
  server.close(() => process.exit(1));
});