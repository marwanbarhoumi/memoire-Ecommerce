const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut excéder 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut être négatif']
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est requis'],
    min: [0, 'Le stock ne peut être négatif'],
    default: 0
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index pour les recherches
productSchema.index({ nom: 'text', description: 'text' });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;