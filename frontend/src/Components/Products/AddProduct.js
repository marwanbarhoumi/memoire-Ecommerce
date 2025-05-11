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
    category: "", // Single string as per backend
    size: "", // Will be converted to array in backend
    color: "", // Will be converted to array in backend
    disponible: true,
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();

      // Required fields
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("qtes", formData.qtes);
      data.append("category", formData.category);

      // Optional fields
      if (formData.description)
        data.append("description", formData.description);
      data.append("disponible", formData.disponible);

      // Array fields (sent as comma-separated strings)
      if (formData.size) data.append("size", formData.size);
      if (formData.color) data.append("color", formData.color);

      // Image handling
      if (formData.image) {
        data.append("image", formData.image);
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
        image: null
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
      <form
        className="add-product-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
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

        {/* Image Field */}
        <div className="form-group">
          <label>Image du produit</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "En cours..." : "Ajouter le Produit"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default AddProductForm;