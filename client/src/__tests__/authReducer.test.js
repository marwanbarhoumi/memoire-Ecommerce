import { authreducer } from '../JS/reducers/authreducer';
import {
  AUTHFAILED,
  CURRENTUSERAUTH,
  LOADING,
  LOGINSUCCESS,
  LOGOUT,
  REGISTERSUCCESS
} from '../JS/actionTypes/authTypes';

describe('authReducer', () => {
  const initialState = {
    authloading: true,
    error: null,
    Alert: "",
    currentUser: {},
    isAuth: false
  };

  test('should return the initial state', () => {
    expect(authreducer(undefined, {})).toEqual(initialState);
  });

  test('should handle LOADING', () => {
    expect(authreducer(initialState, { type: LOADING })).toEqual({
      ...initialState,
      authloading: true
    });
  });

  test('should handle REGISTERSUCCESS', () => {
    const msg = "Inscription réussie";
    expect(authreducer(initialState, { type: REGISTERSUCCESS, payload: msg })).toEqual({
      ...initialState,
      Alert: msg,
      authloading: false
    });
  });

  test('should handle LOGINSUCCESS', () => {
    const payload = {
      token: 'test-token',
      msg: 'Connexion réussie',
      user: { id: 1, name: 'Test User', role: 'client' }
    };
    const result = authreducer(initialState, { type: LOGINSUCCESS, payload });
    
    expect(result).toEqual({
      ...initialState,
      Alert: payload.msg,
      currentUser: payload.user,
      authloading: false,
      isAuth: true
    });
    expect(localStorage.getItem('token')).toBe(payload.token);
  });

  test('should handle CURRENTUSERAUTH', () => {
    const user = { id: 1, name: 'Test User', role: 'client' };
    expect(authreducer(initialState, { type: CURRENTUSERAUTH, payload: user })).toEqual({
      ...initialState,
      currentUser: user,
      authloading: false,
      isAuth: true
    });
  });

  test('should handle LOGOUT', () => {
    // Set initial state with auth data
    const stateWithAuth = {
      ...initialState,
      isAuth: true,
      currentUser: { id: 1, name: 'Test User' }
    };
    localStorage.setItem('token', 'test-token');
    
    const result = authreducer(stateWithAuth, { type: LOGOUT });
    
    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: null,
      Alert: null,
      currentUser: {},
      isAuth: false
    });
    expect(localStorage.getItem('token')).toBeNull();
  });

  test('should handle AUTHFAILED', () => {
    const error = "Erreur d'authentification";
    expect(authreducer(initialState, { type: AUTHFAILED, payload: error })).toEqual({
      ...initialState,
      error: error,
      authloading: false
    });
  });
});