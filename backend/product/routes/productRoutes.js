const express = require("express");
const {
  addProduct,
  getallproducts,
  getoneprod,
  updateprod,
  deleteprod
} = require("../controllers/productController");

const filterproduct = require("../middlewares/filterproduct");
const upload = require("../utils/multer");
const {
  validator,
  AddProductRules
} = require("../middlewares/validation/bodyValidation");
const isAuth = require("../middlewares/authorization/isAuth");
const isAdmin = require("../middlewares/authorization/isAdmin");

const router = express.Router();

/**
 * @route POST /product/add
 * @descripton Ajouter un produit avec une image
 * @acess protected(authentifie+role:admin/seller)
 */
router.post(
  "/add",
  isAuth(),
  isAdmin,
  upload("products").single("image"),
  addProduct
);

/**
 * @route GET /product/
 * @descripton Récupérer tous les produits
 * @acess public
 */
router.get("/", filterproduct, getallproducts);

/**
 * @route GET /product/:idprod
 * @descripton Récupérer un produit par son ID
 * @acess public
 */
router.get("/:idprod", getoneprod);

/**
 * @route PATCH /product/:idprod
 * @descripton Mettre à jour un produit
 * @acess protected
 */
router.put(
  "/:idprod",
  isAuth(),
  isAdmin,
  AddProductRules,
  validator,
  upload("products").single("image"),
  updateprod
);

/**
 * @route DELETE /product/:idprod
 * @descripton Supprimer un produit
 * @acess protected
 */
router.delete("/:idprod", deleteprod);

module.exports = router;
