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
import { setAlert } from './alertAction'; 
import axios from "axios";

/**
 * URL de base pour toutes les requêtes de produits
 * @type {string}
 */
const baseURL = "http://localhost:7000/api/products";

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
 * @route POST /products/add
 * @description Add a new product
 * @access private (admin)
 */
export const addProduct = (formData) => async (dispatch, getState) => {
  dispatch({ type: LOADING });

  try {
    const { auth } = getState();
    const token = auth?.user?.token || localStorage.getItem('token');

    if (!token) {
      dispatch(setAlert('Authentification requise', 'error'));
      throw new Error("Token d'authentification manquant");
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    const { data } = await axios.post(
      'http://localhost:7100/api/products/add',
      formData,
      config
    );

    dispatch({ type: ADDPRODUCTSUCCESS, payload: data.product });
    dispatch(setAlert('Produit ajouté avec succès', 'success'));

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    const errorMessage = error.response?.data?.msg || 
                        error.response?.data?.message || 
                        error.message;

    dispatch({ type: FAILD, payload: errorMessage });
    dispatch(setAlert(`Erreur: ${errorMessage}`, 'error'));

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      setTimeout(() => window.location.href = '/login', 2000);
    }
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
