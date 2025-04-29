export const addToCart = (product) => ({
    type: 'ADD_TO_CART',
    payload: {
      ...product,
      quantity: 1,
      id: product.id || product._id // Assurez-vous d'avoir un identifiant unique
    }
  });