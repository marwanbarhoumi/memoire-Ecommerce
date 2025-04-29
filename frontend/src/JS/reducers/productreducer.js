import {
  FAILD,
  GETONEPRODUCTSSUCCESS,
  GETALLPRODUCTSSUCCESS,
  DELETEPRODUCTSUCCESS,
  ADDPRODUCTSUCCESS,
  LOADING
} from "../actionTypes/producttypes";

const initialState = {
  loading: true,
  products: [],
  error: null,
  proddetails: {},
};

export const productreducers = (state = initialState, { type, payload },action) => {
  switch (type) {
    case LOADING:
      return { ...state, loading: true };
    case GETALLPRODUCTSSUCCESS:
      return { ...state, products: payload, loading: false };
    case GETONEPRODUCTSSUCCESS:
      return { ...state, proddetails: payload, loading: false };
      case ADDPRODUCTSUCCESS:
      return {
        ...state,
        products: [action.payload, ...state.products], // Ajouter le nouveau produit
        loading: false,
      };
      case DELETEPRODUCTSUCCESS:
      return {
        ...state,
        products: state.products.filter((prod) => prod._id !== payload),
      };
    case FAILD:
      return { ...state, error: payload, loading: false }; // J'ai modifié le loading: true en loading: false ici
    default:
      return state;
  }
};
