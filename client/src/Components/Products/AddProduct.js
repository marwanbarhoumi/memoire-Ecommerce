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
    category: [],
    size: [],
    color: [],
    disponible: true,
    img: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim())
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(addProduct(formData));
      // Réinitialiser le formulaire après soumission réussie
      setFormData({
        name: "",
        price: "",
        qtes: "",
        description: "",
        category: [],
        size: [],
        color: [],
        disponible: true,
        img: ""
      });
    } catch (err) {
      setError("Erreur lors de l'ajout du produit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h1 className="add-product-title">Ajouter un nouveau produit</h1>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom du Produit</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Prix (DT)</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>Quantité</label>
          <input
            type="number"
            className="form-control"
            name="qtes"
            value={formData.qtes}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Catégories (séparées par des virgules)</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={formData.category.join(",")}
            onChange={handleArrayChange}
          />
          <p className="array-field-hint">Exemple: Homme,Chemise,Été</p>
        </div>

        <div className="form-group">
          <label>Tailles (séparées par des virgules)</label>
          <input
            type="text"
            className="form-control"
            name="size"
            value={formData.size.join(",")}
            onChange={handleArrayChange}
          />
          <p className="array-field-hint">Exemple: S,M,L,XL</p>
        </div>

        <div className="form-group">
          <label>Couleurs (séparées par des virgules)</label>
          <input
            type="text"
            className="form-control"
            name="color"
            value={formData.color.join(",")}
            onChange={handleArrayChange}
          />
          <p className="array-field-hint">Exemple: Rouge,Bleu,Noir</p>
        </div>

        <div className="form-group">
          <label>Disponible</label>
          <select
            className="form-control"
            name="disponible"
            value={formData.disponible}
            onChange={handleChange}
          >
            <option value={true}>Oui</option>
            <option value={false}>Non</option>
          </select>
        </div>

        <div className="form-group">
          <label>Image (URL)</label>
          <input
            type="text"
            className="form-control"
            name="img"
            value={formData.img}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              Ajout en cours...
              <span className="loading"></span>
            </>
          ) : (
            "Ajouter le Produit"
          )}
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddProductForm;