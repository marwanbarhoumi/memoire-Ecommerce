import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateProduct, getoneproduct as fetchProduct } from "../../JS/action/prodAction";
import { createSelector } from 'reselect'; // Import createSelector
import "../Style/EditProduct.css";

// Create memoized selector
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
  
  // Use the memoized selector
  const {  currentProduct, loading, error } = useSelector(selectProducts);
  
  // Find product with stable reference
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
      {/* ... rest of your JSX remains the same ... */}
    </div>
  );
};

export default EditProduct;