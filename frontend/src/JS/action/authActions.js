import {
  AUTHFAILED,
  CURRENTUSERAUTH,
  LOADING,
  LOGINSUCCESS,
  LOGOUT,
  REGISTERSUCCESS
} from "../actionTypes/authTypes";
import axios from "axios";

// URL de base mise à jour pour les requêtes d'authentification
const baseURL = "http://localhost:7000/api/auth"; // Gateway port 7000
// Inscription
export const register = (newUser, navigate) => async (dispatch) => {
  dispatch({ type: LOADING });

  try {
    const { data } = await axios.post(`${baseURL}/signup`, newUser);

    if (data.msg) {
      dispatch({ type: REGISTERSUCCESS, payload: data.msg });
      alert(data.msg);
    }

    // Redirige vers la page de connexion après inscription
    navigate("/signin");
  } catch (error) {
    dispatch({ 
      type: AUTHFAILED, 
      payload: error.response ? error.response.data : error.message || 'Une erreur inattendue est survenue.' 
    });
    console.error("Erreur lors de l'inscription :", error);

    // Gestion personnalisée des erreurs
    if (error.response?.data?.errors?.array) {
      error.response.data.errors.array.forEach((el) => alert(el.msg));
    } else if (error.response?.data?.msg) {
      alert(error.response.data.msg);
    } else {
      alert("Une erreur inattendue est survenue.");
    }
  }
};

// Connexion
export const login = (user, navigate) => async (dispatch) => {
  dispatch({ type: LOADING });

  try {
    const { data } = await axios.post(`${baseURL}/signin`, user);

    // Stockage du token dans localStorage s'il est présent
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    dispatch({ type: LOGINSUCCESS, payload: data });

    if (data.msg) {
      alert(data.msg);
    }

    // Redirige vers la page d'accueil ou la page protégée selon le rôle
    if (data.user.role === "admin") {
      navigate("/admin_dashbord");
    } else if (data.user.role === "client") {
      navigate("/");
    } else {
      navigate("/seller_dashbord");
    }
  } catch (error) {
    dispatch({ 
      type: AUTHFAILED, 
      payload: error.response ? error.response.data : error.message || 'Une erreur inattendue est survenue.' 
    });
    console.error("Erreur lors de la connexion :", error);

    // Gestion personnalisée des erreurs
    if (error.response?.data?.errors?.array) {
      error.response.data.errors.array.forEach((el) => alert(el.msg));
    } else if (error.response?.data?.msg) {
      alert(error.response.data.msg);
    } else {
      alert("Une erreur inattendue est survenue.");
    }
  }
};

// Obtenir les informations de l'utilisateur authentifié
export const getUser = () => async (dispatch) => {
  dispatch({ type: LOADING });

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Vous devez être connecté pour accéder à cette page.");
    return;
  }

  const opts = {
    headers: { Authorization: `Bearer ${token}` }
  };

  console.log("Token utilisé :", token);

  try {
    const { data } = await axios.get(`${baseURL}/`, opts);
    dispatch({ type: CURRENTUSERAUTH, payload: data.user });

    if (data.msg) {
      alert(data.msg);
    }
  } catch (error) {
    dispatch({ 
      type: AUTHFAILED, 
      payload: error.response ? error.response.data : error.message || 'Une erreur inattendue est survenue.' 
    });
    console.error("Erreur lors de la récupération de l'utilisateur :", error);

    if (error.response?.data?.msg) {
      alert(error.response.data.msg);
    }
  }
};

// Déconnexion
export const logout = () => {
  // Supprime le token du localStorage
  localStorage.removeItem("token");
  return { type: LOGOUT };
};


