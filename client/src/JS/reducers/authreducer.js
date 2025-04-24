import {
  AUTHFAILED,
  CURRENTUSERAUTH,
  LOADING,
  LOGINSUCCESS,
  LOGOUT,
  REGISTERSUCCESS
} from "../actionTypes/authTypes";

const initialState = {
  authloading: true,
  error: null,
  Alert: "",
  currentUser: {},
  isAuth: false
};

export const authreducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOADING:
      return { ...state, authloading: true };
    case REGISTERSUCCESS:
      return { ...state, Alert: payload, authloading: false };
    case LOGINSUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        Alert: payload.msg,
        currentUser: payload.user,
        authloading: false,
        isAuth: true
      };
    case CURRENTUSERAUTH:
      return {
        ...state,
        currentUser: payload,
        authloading: false,
        isAuth: true
      };

    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        loading: true,
        error: null,
        Alert: null,
        currentUser: {},
        isAuth: false
      };

    case AUTHFAILED:
      return { ...state, error: payload, authloading: false };

    default:
      return state;
  }
};
