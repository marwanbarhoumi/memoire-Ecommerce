
const express = require("express");
const router = express.Router();
const { createCommande, getAllCommandes } = require("../Controllers/CommandeController");
const {authenticateJWT}  = require ("../middlewares/authorization/isAuth")

router.post('/commandes', authenticateJWT, createCommande);
router.get('/commandes', (req, res) => {
  console.log("Route /commandes atteinte avec succès");
  getAllCommandes(req, res)
    .catch(error => {
      console.error("Error in route handler:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});
module.exports = router;
