import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct } from "../../JS/action/prodAction";
import "../Style/ProductCard.css"; // Fichier CSS pour les styles supplémentaires

const ProductCard = ({ prd }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      dispatch(deleteProduct(prd._id));
    }
  };

  return (
    <Card className="product-card">
      <div className="card-image-container">
        <Card.Img
          variant="top"
          src={prd.img.replace("http://localhost:4000", "http://localhost:7003")}
          className="card-image"
          alt={prd.name}
        />
        {!prd.qtes && (
          <div className="out-of-stock-badge">Épuisé</div>
        )}
      </div>
      
      <Card.Body className="card-body">
        <Card.Title className="product-title">{prd.name}</Card.Title>
        
        <div className="price-section">
          <Card.Text className="product-price">{prd.price} DT</Card.Text>
          <Card.Text className={`product-stock ${!prd.qtes ? "out-of-stock" : ""}`}>
            {prd.qtes ? `En stock: ${prd.qtes}` : "Non disponible"}
          </Card.Text>
        </div>

        <div className="buttons-container">
          <Link to={`/products/${prd._id}`} className="details-link">
            <Button variant="primary" className="details-btn">
              Voir détails
            </Button>
          </Link>

          {currentUser?.role === "admin" && (
            <div className="admin-buttons">
              <Link to={`/edit/${prd._id}`}>
                <Button variant="warning" className="edit-btn">
                  Modifier
                </Button>
              </Link>
              <Button variant="danger" className="delete-btn" onClick={handleDelete}>
                Supprimer
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;