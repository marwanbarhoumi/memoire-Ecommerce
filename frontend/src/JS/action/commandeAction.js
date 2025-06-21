import axios from "axios";
import { setAlert } from './alertActions';



/**
 * 
 * Récupérer toutes les commandes
 */
export const getCommandes = () => async (dispatch) => {
  try {
    // URL absolument garantie
    const response = await axios.get('http://localhost:7005/api/commandes');
    
    console.log("Réponse API:", response.data); // Debug essentiel

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Format de réponse inattendu");
    }

    dispatch({ 
      type: 'COMMANDES_SUCCESS', 
      payload: response.data.data || [] // Garantit un tableau même si vide
    });

  } catch (error) {
    console.error("Échec critique:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    
    dispatch({
      type: 'COMMANDES_FAIL',
      payload: "Problème de connexion avec le serveur"
    });
  }
};

/**
 * Ajouter une commande
 */
/**
 * @route POST /api/commandes
 * @description Créer une nouvelle commande
 * @access private (client)
 */
export const addCommande = (commandeData) => async (dispatch, getState) => {
  dispatch({ type: 'COMMANDE_LOADING' });

  try {
    const { auth, cart } = getState();
    const token = auth?.user?.token || localStorage.getItem('token');
    // Validation
    if (!token) {
      dispatch(setAlert('Authentification requise', 'error'));
      throw new Error("Token d'authentification manquant");
    }

    if (!cart.items || cart.items.length === 0) {
      dispatch(setAlert('Le panier est vide', 'error'));
      throw new Error("Panier vide");
    }

    // Formatage des données
    const formattedData = {
      user: auth.user._id,
      produits: cart.items.map(item => ({
        productId: item._id,
        nom: item.name,
        prix: item.price,
        quantite: item.quantity
      })),
      total: cart.total
    };

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    // Envoi de la commande
    const { data } = await axios.post(
      'http://localhost:7005/api/commandes',
      formattedData,
      config
    );

    // Réponse réussie
    dispatch({ 
      type: 'COMMANDE_SUCCESS', 
      payload: data.commande 
    });
    dispatch(setAlert('Commande passée avec succès', 'success'));

    // Redirection après succès
    setTimeout(() => {
      window.location.href = `/confirmation/${data.commande.reference}`;
    }, 1500);

  } catch (error) {
    console.error('Détails de l\'erreur:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    const errorMessage = error.response?.data?.message || 
                        error.message ||
                        'Erreur lors de la commande';

    dispatch({ 
      type: 'COMMANDE_FAIL', 
      payload: errorMessage 
    });
    dispatch(setAlert(`Erreur: ${errorMessage}`, 'error'));

    // Gestion spécifique des erreurs 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      setTimeout(() => window.location.href = '/login', 2000);
    }

    // Gestion des erreurs de stock
    if (error.response?.status === 400 && error.response.data?.stockError) {
      dispatch({
        type: 'UPDATE_STOCK_ERROR',
        payload: error.response.data.products
      });
    }
  }
};



