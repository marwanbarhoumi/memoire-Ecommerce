/* eslint-disable no-template-curly-in-string */
import {
  FAILD,
  GETALLPRODUCTSSUCCESS,
  GETONEPRODUCTSSUCCESS,
  DELETEPRODUCTSUCCESS,
  ADDPRODUCTSUCCESS,
  LOADING,
  UPDATE_PRODUCT_SUCCESS
} from "../actionTypes/producttypes";
import axios from "axios";

/**
 * URL de base pour toutes les requêtes de produits
 * @type {string}
 */
const baseURL = "http://localhost:7003/api/products";

/**
 * @route GET /product/
 * @description Get all products
 * @access public
 */
export const getallproducts      = () => async (dispatch) => {
  dispatch({ type: LOADING });
  try {
    const { data } = await axios.get(baseURL);
    dispatch({ type: GETALLPRODUCTSSUCCESS, payload: data.products });
  } catch (error) {
    dispatch({ type: FAILD, payload: error });
  }
};

/**
 * @route GET /product/:idprod
 * @description Get one product
 * @access public
 */
export const getoneproduct   = (idprod) => async (dispatch) => {
  dispatch({ type: LOADING });
  try {
    const { data } = await axios.get(`${baseURL}/${idprod}`);
    dispatch({ type: GETONEPRODUCTSSUCCESS, payload: data.product });
  } catch (error) {
    console.error("Erreur lors de la récupération du produit :", error);
    dispatch({ type: FAILD, payload: error });
  }
};

/**
 * @route DELETE /product/:id
 * @description Delete a product
 * @access private (admin)
 */
export const deleteProduct = (id) => async (dispatch) => {
  try {
    await axios.delete(`${baseURL}/${id}`);
    dispatch({ type: DELETEPRODUCTSUCCESS, payload: id });
  } catch (error) {
    console.error("Erreur de suppression:", error.response?.data || error.message);
    dispatch({ type: FAILD, payload: error.response?.data });
  }
};


/**
 * @route POST /product/add
 * @description Add a new product
 * @access private (admin)
 */
export const addProduct = (productData) => async (dispatch, getState) => {
  dispatch({ type: LOADING });

  try {
    // Récupérer le token depuis Redux
    const { auth } = getState();
    const token = auth?.user?.token;

    // Si le token est introuvable dans Redux, essaie de le récupérer depuis localStorage
    if (!token) {
      const tokenFromLocalStorage = localStorage.getItem('token');
      if (!tokenFromLocalStorage) {
        throw new Error("Utilisateur non authentifié");
      }
    }

    // Configuration des headers avec le token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // Pas de Content-Type si FormData
      },
    };

    // Envoyer la requête POST pour ajouter le produit avec la route /add
    const { data } = await axios.post(`${baseURL}/add`, productData, config);

    // Dispatch du succès
    dispatch({ type: ADDPRODUCTSUCCESS, payload: data.product });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error.response?.data || error.message);
    dispatch({ type: FAILD, payload: error.response?.data || error.message });
  }
};


/**
 * @route PATCH /products/:id
 * @description Update a product
 * @access private (admin)
 */
export const updateProduct = (id, productData) => async (dispatch) => {
  dispatch({ type: LOADING });
  try {
    const { data } = await axios.patch(`${baseURL}/${id}`, productData);
    dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data.product });
    return data.product;
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error.response?.data || error.message);
    dispatch({ type: FAILD, payload: error.response?.data || error.message });
    throw error;
  }
};
