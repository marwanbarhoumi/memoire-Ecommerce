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

const api = axios.create({
  baseURL: "http://localhost:7004", // Adaptez selon votre configuration
  timeout: 5000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

    // Utilisez l'instance 'api' configurée au lieu de axios directement
    const { data } = await api.get("/auth/all");

    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
      payload:
        error.response?.data?.message ||
        (error.response?.status === 401 ? "Session expirée" : error.message)
    });

    // Ne pas rediriger ici car l'intercepteur s'en charge
  }
};

export const banUser = (userId, isBan) => async (dispatch) => {
  try {
    dispatch({ type: USER_BAN_REQUEST });

    // Utilisez l'instance 'api' et le bon endpoint
    await api.put(`/auth/users/${userId}/ban`, { isBan });

    dispatch({ type: USER_BAN_SUCCESS, payload: { userId, isBan } });

    // Rafraîchir la liste après bannissement
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

    // Updated endpoint to match your backend
    const response = await api.delete(`/auth/users/${userId}`);

    dispatch({ type: USER_DELETE_SUCCESS, payload: userId });
    dispatch(setAlert("User deleted successfully", "success"));

    // Refresh user list
    dispatch(getAllUsers());

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      (error.response?.status === 404
        ? "User not found"
        : "Failed to delete user");

    dispatch({
      type: USER_DELETE_FAIL,
      payload: errorMessage
    });

    dispatch(setAlert(errorMessage, "error"));
    throw error;
  }
};
