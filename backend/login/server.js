const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });
const connectDB = require("./config/DB");

const app = express();

// ✅ Connexion MongoDB
connectDB();

// ✅ CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://192.168.49.2:31520'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`⛔ CORS bloqué pour : ${origin}`);
    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Middlewares
app.use(express.json()); // body-parser
require("./middlewares/authorization/isAuth"); // init Passport JWT

// ✅ Routes d'authentification
const authRouter = require("./routes/authRoutes");
app.use("/api/auth", authRouter);

// ✅ Route de test / health check
app.get("/api/auth/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "login",
    timestamp: new Date().toISOString()
  });
});

// ✅ Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur interne :", err.message);
  res.status(500).json({ error: "Erreur serveur" });
});

// ✅ Lancement serveur
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
  console.log(`✅ Auth Service en ligne sur http://localhost:${PORT}/api/auth`);
  console.log(`🔐 CORS autorisé pour : ${allowedOrigins.join(", ")}`);
});
