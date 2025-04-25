import axios from "axios";
import {
  USER_LIST_SUCCESS,
  USER_BAN_REQUEST,
  USER_BAN_SUCCESS,
  USER_BAN_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL
} from "../actionTypes/clientTypes";
import { setAlert } from "../action/alertAction";

const api = axios.create({
  baseURL: "http://localhost:7004",
  timeout: 5000
});

// Intercepteur pour ajouter le token JWT
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

// Intercepteur pour gérer les erreurs 401
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
    const { data } = await api.get("/api/users/"); // Notez le / final
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    console.error("Erreur complète:", error.response || error);
  }
};

export const banUser = (userId, isBan) => async (dispatch) => {
  try {
    dispatch({ type: USER_BAN_REQUEST });

    // Correction : Utilisation de la bonne route /api/users/:id/ban
    await api.put(`/api/users/${userId}/ban`, { isBan });

    dispatch({ type: USER_BAN_SUCCESS, payload: { userId, isBan } });
    dispatch(getAllUsers()); // Rafraîchir la liste
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

    // Correction : Utilisation de la bonne route /api/users/:id
    const response = await api.delete(`/api/users/${userId}`);

    dispatch({ type: USER_DELETE_SUCCESS, payload: userId });
    dispatch(setAlert("Utilisateur supprimé avec succès", "success"));
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
    
    dispatch(setAlert(errorMessage, "error"));
    throw error;
  }
};