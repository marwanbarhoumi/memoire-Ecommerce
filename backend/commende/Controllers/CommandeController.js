const Commande = require("../model/Commande");

const Product = require("../model/Product");


// Dans Controllers/CommandeController.js
exports.createCommande = async (req, res) => {
  try {
    const { produits, total } = req.body;

    // Validation du stock
    for (const item of produits) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Produit non trouvé: ${item.productId}`
        });
      }
      if (product.stock < item.quantite) {
        return res.status(400).json({
          success: false,
          message: `Stock insuffisant pour ${product.nom}`
        });
      }
    }

    // Création de la commande
    const commande = await Commande.create({
      user: req.user._id,
      produits,
      total,
      reference: `CMD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    });

    // Mise à jour du stock
    for (const item of produits) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantite }
      });
    }

    res.status(201).json({
      success: true,
      commande
    });

  } catch (error) {
    console.error("Erreur création commande:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Version optimisée du contrôleur
exports.getAllCommandes = async (req, res) => {
  try {
    console.log("Début de la récupération des commandes...");
    
    // 1. Construction de la requête avec population
    const query = Commande.find({})
      .populate({
        path: 'user',
        select: 'nom email',
        model: 'User' // Spécification explicite du modèle
      })
      .populate({
        path: 'produits.productId',
        select: 'nom prix',
        model: 'Product' // Spécification explicite
      })
      .lean(); // Conversion en objets JS simples pour meilleure performance

    // 2. Exécution avec timeout
    const commandes = await query.maxTimeMS(10000); // 10s timeout
    
    // 3. Validation des données
    if (!commandes || !Array.isArray(commandes)) {
      throw new Error('Format de données invalide');
    }

    console.log(`Succès: ${commandes.length} commandes trouvées`);
    
    // 4. Réponse formatée
    res.json({
      success: true,
      count: commandes.length,
      data: commandes,
      metadata: {
        timestamp: new Date().toISOString(),
        apiVersion: '1.0'
      }
    });

  } catch (error) {
    console.error("Erreur complète:", {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

    // Gestion d'erreur améliorée
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      errorType: error.name,
      message: process.env.NODE_ENV === 'production' 
        ? 'Erreur de traitement' 
        : error.message,
      details: process.env.NODE_ENV === 'development' 
        ? { stack: error.stack, fullError: error }
        : undefined
    });
  }
};