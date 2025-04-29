import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import "./Style/Home.css"; // Importez le fichier CSS
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Hero Section */}
      <main className="hero-section">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="hero-title">
            Bienvenue sur notre Boutique
          </h1>
          <p className="hero-subtitle">
            Découvrez notre collection exclusive de vêtements pour hommes.
            Style, qualité et élégance réunis pour vous.
          </p>

          {/* Button */}
          <button 
            onClick={() => navigate('/products')}
            className="hero-button flex items-center justify-center"
          >
            <ShoppingBag className="mr-2 h-6 w-6" />
            Voir Nos Produits
          </button>
        </div>
        
        {/* Features Section */}
        <div className="features-section">
          <div className="features-grid">
            {[
              { title: "Qualité Premium", text: "Tous nos produits sont fabriqués avec les meilleurs matériaux pour une durabilité exceptionnelle." },
              { title: "Livraison Rapide", text: "Recevez vos articles en 48h avec notre service de livraison express partout en France." },
              { title: "Satisfaction Garantie", text: "Satisfait ou remboursé sous 30 jours, nous garantissons votre entière satisfaction." }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-text">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Home;