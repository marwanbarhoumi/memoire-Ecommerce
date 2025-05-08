import axios from "axios";
import {
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_BAN_REQUEST,
  USER_BAN_SUCCESS,
  USER_BAN_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL
} from "../actionTypes/clientTypes";
import { setAlert } from "../action/alertAction";

// Modification de la baseURL pour pointer vers le port 7004
const api = axios.create({
  baseURL: "http://localhost:7004", // Changé de 4000 à 7004
  timeout: 5000
});

// Intercepteur pour le token (fonctionnel)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USER_LIST_REQUEST });

    // Assurez-vous que l'endpoint correspond à votre nouvelle API sur le port 7004
    const { data } = await api.get("/api/users"); // Modifié "/auth/all" vers "/api/users" ou l'endpoint approprié

    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response?.data?.message ||
        (error.response?.status === 401 ? "Session expirée" : error.message)
    });
  }
};

export const banUser = (userId, isBan) => async (dispatch) => {
  try {
    dispatch({ type: USER_BAN_REQUEST });

    // Adaptez l'endpoint selon votre nouvelle API
    await api.put(`/api/users/${userId}/ban`, { isBan }); // Modifié "/auth/users/" vers "/api/users/"

    dispatch({ type: USER_BAN_SUCCESS, payload: { userId, isBan } });
    dispatch(getAllUsers());
  } catch (error) {
    dispatch({
      type: USER_BAN_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });
    
    // Adaptez l'endpoint selon votre nouvelle API
    const response = await api.delete(`/api/users/${userId}`); // Modifié "/auth/users/" vers "/api/users/"
    
    dispatch({ type: USER_DELETE_SUCCESS, payload: userId });
    dispatch(setAlert('User deleted successfully', 'success'));
    dispatch(getAllUsers());
    
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.status === 404
      ? "Utilisateur introuvable"
      : error.response?.data?.message || "Erreur lors de la suppression";
    
    dispatch({
      type: USER_DELETE_FAIL,
      payload: errorMessage
    });
    
    dispatch(setAlert(errorMessage, 'error'));
    throw error;
  }
};