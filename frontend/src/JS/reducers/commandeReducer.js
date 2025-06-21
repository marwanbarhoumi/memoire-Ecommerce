import { 
    COMMANDE_LOADING,
    COMMANDE_SUCCESS,
    COMMANDE_FAIL,
    RESET_COMMANDE
  } from '../actionTypes/commendeTypes';
  
  const initialState = {
    loading: false,
    commande: null,
    error: null,
    stockErrors: []
  };
  
  export const commandeReducer = (state = initialState, action) => {
    switch (action.type) {
      case COMMANDE_LOADING:
        return { ...state, loading: true };
  
      case COMMANDE_SUCCESS:
        return { 
          ...state, 
          loading: false, 
          commande: action.payload,
          error: null 
        };
  
      case COMMANDE_FAIL:
        return { 
          ...state, 
          loading: false, 
          error: action.payload 
        };
  
      case RESET_COMMANDE:
        return initialState;
  
      default:
        return state;
    }
  };