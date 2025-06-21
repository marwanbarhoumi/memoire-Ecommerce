const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  produits: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    quantite: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  reference: { type: String, unique: true },
  statut: { 
    type: String, 
    enum: ["en-attente", "validée", "expédiée", "annulée"],
    default: "en-attente"
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Commande", commandeSchema);