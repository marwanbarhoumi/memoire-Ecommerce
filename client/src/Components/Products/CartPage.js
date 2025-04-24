import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../Style/CartPage.css';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-container">
      <h1>PANIER</h1>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="item-ref">Réf: {item.id}</p>
            </div>
            <div className="item-price">
              <p>{item.price.toFixed(3)} DT</p>
              <p>{item.price.toFixed(3)} DT</p>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h3>Total TTC</h3>
        <p>{total.toFixed(3)} DT</p>
      </div>

      <div className="cart-actions">
        <Link to="/products" className="continue-shopping">
          ← Continuer mes achats
        </Link>
        <button className="checkout-btn">Commander →</button>
      </div>
    </div>
  );
};

export default CartPage;