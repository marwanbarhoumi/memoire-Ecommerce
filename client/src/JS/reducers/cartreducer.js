const initialState = {
    items: [] // Structure initiale obligatoire
  };
  
  export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_TO_CART':
        // Créer un nouvel état avec le nouvel article ajouté
        return {
          ...state, // Copie toutes les propriétés existantes de l'état
          items: [...state.items, action.payload] // Ajoute le nouvel article
        };
          
      case 'CLEAR_CART':
        return { items: [] };
          
      default:
        return state; // Toujours retourner l'état actuel par défaut
    }
  };