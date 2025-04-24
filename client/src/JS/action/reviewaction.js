import {
  ADDREVIEWSSUCCESS,
  GETALLPRODUCTREVIEWSSUCCESS,
  RFAILD,
  RLOADING
} from "../actionTypes/reviewtypes";
import axios from "axios";

// Configuration de l'instance Axios pour toutes les requêtes
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:7003/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @route GET /reviews/:productId
 * @description Récupère tous les avis d'un produit
 * @access Public
 */
export const getproductreviews = (productId) => async (dispatch) => {
  dispatch({ type: RLOADING });
  try {
    const { data } = await apiClient.get(`/reviews/${productId}`);
    dispatch({ 
      type: GETALLPRODUCTREVIEWSSUCCESS, 
      payload: data.reviews || [] 
    });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
      "Erreur lors du chargement des avis";
    console.error("getproductreviews error:", errorMessage);
    dispatch({ 
      type: RFAILD, 
      payload: errorMessage 
    });
  }
};

/**
 * @route POST /reviews/:productId
 * @description Ajoute un nouvel avis pour un produit
 * @access Public (ou Privé si besoin d'authentification)
 */
export const addreview = (productId, newReview) => async (dispatch) => {
  dispatch({ type: RLOADING });
  try {
    // Validation simple côté client
    if (!newReview.comment || !newReview.rating) {
      throw new Error("Le commentaire et la note sont requis");
    }

    const { data } = await apiClient.post(
      `/reviews/${productId}`,
      newReview
    );

    dispatch({ 
      type: ADDREVIEWSSUCCESS,
      payload: data.message || "Avis ajouté avec succès"
    });
    
    // Recharger les avis après ajout
    dispatch(getproductreviews(productId));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
      error.message || 
      "Erreur lors de l'ajout de l'avis";
    console.error("addreview error:", errorMessage);
    dispatch({ 
      type: RFAILD, 
      payload: errorMessage 
    });
  }
};