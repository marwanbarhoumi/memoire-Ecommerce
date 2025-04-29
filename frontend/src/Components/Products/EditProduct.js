import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateProduct, getoneproduct as fetchProduct } from "../../JS/action/prodAction";
import { createSelector } from 'reselect';
import "../Style/EditProduct.css";

const selectProductState = state => state.products || {};
const selectProducts = createSelector(
  [selectProductState],
  (productsState) => ({
    products: productsState.products || [],
    currentProduct: productsState.currentProduct,
    loading: productsState.loading,
    error: productsState.error
  })
);

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentProduct, loading, error } = useSelector(selectProducts);
  
  const product = useSelector(state => 
    currentProduct || (state.products?.products || []).find(p => p._id === id),
    (a, b) => a?._id === b?._id
  );

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });

  useEffect(() => {
    if (!product) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id, product]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        image: product.image || "",
      });
    }
  }, [product]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(updateProduct(id, {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    }))
    .then(() => {
      navigate("/products");
    })
    .catch(error => {
      console.error("Erreur lors de la mise à jour:", error);
    });
  };

  if (loading) return <p>Chargement du produit...</p>;
  if (error) return <p>Erreur: {error.message || "Impossible de charger le produit"}</p>;
  if (!product) return <p>Produit non trouvé</p>;

  return (
    <div className="edit-product-container">
      <h2>Modifier le Produit</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Prix:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="submit-btn">
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default EditProduct;