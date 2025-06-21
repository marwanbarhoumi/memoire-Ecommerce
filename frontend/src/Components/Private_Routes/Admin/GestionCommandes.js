import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../Style/GestionCommandes.css"
const GestionCommandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const response = await axios.get('http://localhost:7005/api/commandes');
        
        console.log("Données reçues:", response.data); // Debug
        
        if (response.data.success && Array.isArray(response.data.data)) {
          setCommandes(response.data.data);
        } else {
          throw new Error("Format de données invalide");
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container">
      <h1>Gestion des Commandes</h1>
      
      {commandes.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {commandes.map(commande => (
              <tr key={commande._id}>
                <td>{commande.reference || 'N/A'}</td>
                <td>{commande.userId || 'Guest'}</td>
                <td>{commande.total?.toFixed(2)} DT</td>
                <td>
                  <span className={`badge ${commande.statut === 'en attente' ? 'bg-warning' : 'bg-success'}`}>
                    {commande.statut}
                  </span>
                </td>
                <td>
                  {commande.createdAt ? new Date(commande.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">
          Aucune commande trouvée dans la base de données
        </div>
      )}
    </div>
  );
};

export default GestionCommandes;