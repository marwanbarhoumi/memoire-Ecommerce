require("dotenv").config({ path: "./config/.env" });
const passport = require("passport");
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/DB');
const commendeRoutes = require('./routes/commendeRoutes');
require("./middlewares/authorization/isAuth");
const app = express();

// Middleware important
app.use(cors({
  origin: 'http://localhost:3000', // ou votre URL frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api', commendeRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: "Le serveur fonctionne !" });
});

// Connexion à la base de données
connectDB();

const PORT = process.env.PORT || 7005;
app.listen(PORT, '0.0.0.0', () => { // Écoute sur toutes les interfaces
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});