import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { addreview, getproductreviews } from "../../JS/action/reviewaction";
import { getoneproduct } from "../../JS/action/prodAction";
import { addToCart } from "../../JS/action/cartActions";
import "../Style/ProductDetails.css";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { idprod } = useParams();

  // États Redux
  const { 
    proddetails = null, 
    loading: productLoading = true, 
    error: productError = null 
  } = useSelector((state) => state.prod) || {};

  const { 
    reviews = [], 
    loading: reviewsLoading = false,
    error: reviewsError = null
  } = useSelector((state) => state.rev) || {};

  // État local pour le formulaire d'avis
  const [review, setReview] = useState({ 
    comment: "", 
    rating: 5 
  });

  // État pour le bouton "Ajouter au panier"
  const [cartStatus, setCartStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  // Chargement des données
  useEffect(() => {
    dispatch(getoneproduct(idprod));
    dispatch(getproductreviews(idprod));
  }, [dispatch, idprod]);

  // Gestion des changements du formulaire
  const handleChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  // Gestion de la note
  const handleRatingChange = (rating) => {
    setReview({ ...review, rating });
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (review.comment.trim()) {
      dispatch(addreview(idprod, { 
        ...review, 
        product: idprod 
      }));
      setReview({ comment: "", rating: 5 });
    }
  };

  // Gestion de l'ajout au panier
  const handleAddToCart = async () => {
    if (!proddetails) return;

    try {
      setCartStatus({ loading: true, success: false, error: null });
      
      await dispatch(addToCart({
        productId: proddetails._id,
        name: proddetails.name,
        price: proddetails.price,
        image: proddetails.img,
        quantity: 1
      }));

      setCartStatus({ loading: false, success: true, error: null });
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        setCartStatus({ loading: false, success: false, error: null });
      }, 3000);
      
    } catch (error) {
      setCartStatus({ 
        loading: false, 
        success: false, 
        error: error.message || "Erreur lors de l'ajout au panier" 
      });
    }
  };

  // Affichage pendant le chargement
  if (productLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  // Gestion des erreurs
  if (productError || !proddetails) {
    return (
      <div className="error-container">
        <h2>Erreur</h2>
        <p>{productError || "Produit non trouvé"}</p>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-header">
        <h1>DÉTAILS DU PRODUIT</h1>
      </div>

      <div className="product-content">
        {/* Section Image */}
        <div className="product-image-section">
          <img
            src={proddetails.img || "/images/default-product.jpg"}
            alt={proddetails.name}
            className="product-image"
            onError={(e) => {
              e.target.src = "/images/default-product.jpg";
            }}
          />
        </div>

        {/* Section Informations */}
        <div className="product-info-section">
          <h2 className="product-title">{proddetails.name}</h2>
          <p className="product-price">{proddetails.price} DT</p>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Genre:</span>
              <span className="meta-value">{proddetails.category}</span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">Taille:</span>
              <span className="meta-value">{proddetails.size}</span>
            </div>
            
            <div className="meta-item">
              <span className="meta-label">Couleur:</span>
              <span className="meta-value">{proddetails.color}</span>
            </div>
          </div>

          {/* Bouton Ajouter au panier */}
          <button
            onClick={handleAddToCart}
            className={`add-to-cart-btn ${cartStatus.success ? "success" : ""}`}
            disabled={cartStatus.loading}
          >
            {cartStatus.loading ? (
              "Ajout en cours..."
            ) : cartStatus.success ? (
              "✓ Ajouté au panier"
            ) : (
              <>
                <FaShoppingCart className="cart-icon" />
                Ajouter au panier
              </>
            )}
          </button>

          {cartStatus.error && (
            <p className="error-message">{cartStatus.error}</p>
          )}

          {/* Section Avis */}
          <div className="reviews-section">
            <h3>Avis des clients ({reviews.length})</h3>
            
            {reviewsLoading ? (
              <p>Chargement des avis...</p>
            ) : reviewsError ? (
              <p className="error-text">{reviewsError}</p>
            ) : reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev._id} className="review-item">
                  <div className="review-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < rev.rating ? "filled" : ""}
                      />
                    ))}
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p>Soyez le premier à donner votre avis</p>
            )}
          </div>

          {/* Formulaire d'avis */}
          <form onSubmit={handleSubmit} className="review-form">
            <h3>Ajouter un avis</h3>
            
            <div className="rating-input">
              <span>Note:</span>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < review.rating ? "filled" : ""}
                    onClick={() => handleRatingChange(i + 1)}
                  />
                ))}
              </div>
            </div>
            
            <textarea
              name="comment"
              placeholder="Votre avis sur ce produit..."
              value={review.comment}
              onChange={handleChange}
              required
              minLength="10"
            />
            
            <button 
              type="submit" 
              className="submit-review-btn"
              disabled={!review.comment.trim()}
            >
              Envoyer l'avis
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;