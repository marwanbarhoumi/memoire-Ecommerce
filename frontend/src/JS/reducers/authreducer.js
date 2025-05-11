import {
  AUTHFAILED,
  CURRENTUSERAUTH,
  LOADING,
  LOGINSUCCESS,
  LOGOUT,
  REGISTERSUCCESS
} from "../actionTypes/authTypes";

const initialState = {
  authloading: false,
  error: null,
  Alert: "",
  currentUser: {},
  isAuth: false
};

export const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOADING:
      return { ...state, authloading: true, error: null };

    case REGISTERSUCCESS:
      return {
        ...state,
        Alert: payload.msg || payload,
        authloading: false,
        error: null
      };

    case LOGINSUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        Alert: payload.msg,
        currentUser: payload.user,
        authloading: false,
        isAuth: true,
        error: null
      };

    case CURRENTUSERAUTH:
      return {
        ...state,
        currentUser: payload,
        authloading: false,
        isAuth: true,
        error: null
      };

    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...initialState,
        authloading: false
      };

    case AUTHFAILED:
      return {
        ...state,
        error: payload,
        authloading: false
      };

    default:
      return state;
  }
};
