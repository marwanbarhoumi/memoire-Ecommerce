const initialState = {
  users: [],
  loading: false,
  error: null
};

export const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LIST_REQUEST':
      return { ...state, loading: true, error: null };
    
    case 'USER_LIST_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        users: action.payload.users || action.payload 
      };
    
    case 'USER_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };
    
    case 'USER_BAN_SUCCESS':
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload.userId 
            ? { ...user, isBan: action.payload.isBan } 
            : user
        )
      };
    
    case 'USER_DELETE_SUCCESS':
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
    
    default:
      return state;
  }
};