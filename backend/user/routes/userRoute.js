const express = require("express");
const router = express.Router();
const { deleteUser, getUsers } = require("../controllers/userController");
const isAdmin = require("../midlewares/authorization/isAdmin");
const isAuth = require("../midlewares/authorization/isAuth");

// Route GET corrigée (sans espace)
router.get("/users", isAuth(), isAdmin, getUsers);

// Route DELETE (déjà correcte)
router.delete("/users/:id", isAuth(), deleteUser);

module.exports = router;