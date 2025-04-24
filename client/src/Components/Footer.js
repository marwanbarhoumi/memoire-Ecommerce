import React from "react";
import  "./Style/Footer.css";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="grid">
          {/* Section Boutique */}
          <div className="section">
            <h3>Boutique</h3>
            <ul>
              {["Collections", "Promotions", "Carte Cadeau"].map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Société */}
          <div className="section">
            <h3>Société</h3>
            <ul>
              {["À propos", "Carrières", "Presse", "Responsabilité", "Affiliés"].map((item) => (
                <li key={item}>
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Contact */}
          <div className="section contact-section">
            <h3>Contact</h3>
            <p>
              <strong>Téléphone :</strong> +216 99 999 999
            </p>
            <p>
              <strong>Email :</strong>{" "}
              <a href="mailto:contact@memboutique.com">shop77@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="bottom-footer">
          <p>© {currentYear} Mens Boutique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
