import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../../JS/action/prodAction";
import "../Style/addProd.css";

const AddProductForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    qtes: "",
    description: "",
    category: "",
    size: "",
    color: "",
    disponible: true,
    image: null,
    imgUrl: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ 
      ...formData, 
      image: e.target.files[0],
      imgUrl: "" // Reset URL si un fichier est sélectionné
    });
  };

 const validateImageUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url); // Valide que c'est une URL bien formée
    
    // Vérifie soit l'extension dans le chemin, soit des motifs connus (comme Google Images)
    return (
      /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url) || // Extensions classiques
      /(encrypted-tbn0\.gstatic\.com|googleusercontent\.com)/i.test(url) || // Google Images
      /(\.(jpg|jpeg|png|gif|webp)\?|&(format|type)=(jpe?g|png|gif|webp))/i.test(url) // URLs avec paramètres
    );
  } catch {
    return false;
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.name || !formData.price || !formData.qtes || !formData.category) {
      setError("Les champs marqués d'un * sont obligatoires");
      setLoading(false);
      return;
    }

    if (formData.imgUrl && !validateImageUrl(formData.imgUrl)) {
      setError("Veuillez entrer une URL d'image valide (jpg, png, gif, webp)");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();

      // Required fields
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("qtes", formData.qtes);
      data.append("category", formData.category);

      // Optional fields
      if (formData.description) data.append("description", formData.description);
      data.append("disponible", formData.disponible);

      // Array fields
      if (formData.size) data.append("size", formData.size);
      if (formData.color) data.append("color", formData.color);

      // Image handling (file OR URL)
      if (formData.image) {
        data.append("image", formData.image);
      } else if (formData.imgUrl) {
        data.append("imgUrl", formData.imgUrl);
      }

      await dispatch(addProduct(data));

      // Reset form
      setFormData({
        name: "",
        price: "",
        qtes: "",
        description: "",
        category: "",
        size: "",
        color: "",
        disponible: true,
        image: null,
        imgUrl: ""
      });
      
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h1 className="add-product-title">Ajouter un nouveau produit</h1>
      
      {error && <div className="error-message">{error}</div>}

      <form className="add-product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* Name Field */}
        <div className="form-group">
          <label>Nom du Produit*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Price Field */}
        <div className="form-group">
          <label>Prix (DT)*</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Quantity Field */}
        <div className="form-group">
          <label>Quantité*</label>
          <input
            type="number"
            name="qtes"
            value={formData.qtes}
            onChange={handleChange}
            className="form-control"
            required
            min="0"
          />
        </div>

        {/* Category Field */}
        <div className="form-group">
          <label>Catégorie*</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
          />
        </div>

        {/* Size Field */}
        <div className="form-group">
          <label>Tailles (séparées par virgule)</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="form-control"
            placeholder="S,M,L,XL"
          />
        </div>

        {/* Color Field */}
        <div className="form-group">
          <label>Couleurs (séparées par virgule)</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="form-control"
            placeholder="Rouge,Bleu,Noir"
          />
        </div>

        {/* Availability Field */}
        <div className="form-group">
          <label>Disponible</label>
          <select
            name="disponible"
            value={formData.disponible}
            onChange={handleChange}
            className="form-control"
          >
            <option value={true}>Oui</option>
            <option value={false}>Non</option>
          </select>
        </div>

        {/* Image Fields */}
        <div className="form-group image-options">
          <div>
            <label>Uploader une image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="form-control"
              accept="image/*"
            />
          </div>
          
          <div className="divider">OU</div>
          
          <div>
            <label>Utiliser une URL d'image</label>
            <input
              type="text"
              name="imgUrl"
              value={formData.imgUrl}
              onChange={handleChange}
              className="form-control"
              placeholder="https://example.com/image.jpg"
              disabled={!!formData.image}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "En cours..." : "Ajouter le Produit"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;