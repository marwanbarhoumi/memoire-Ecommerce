import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import SignIn from './SignIn';
import { authReducer } from '../../JS/reducers/authReducer';
import * as authActions from '../../JS/action/authActions';

// Mock de l'action login
jest.mock('../../JS/action/authActions', () => ({
  ...jest.requireActual('../../JS/action/authActions'),
  login: jest.fn(),
}));

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });
};

describe('SignIn Component', () => {
  let store;

  beforeEach(() => {
    store = createTestStore({
      auth: {
        loading: false,
        error: null,
        Alert: null,
      },
    });
    authActions.login.mockClear();
    mockNavigate.mockClear();
  });

  const renderWithProviders = (component, { route = '/' } = {}) => {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {component}
        </MemoryRouter>
      </Provider>
    );
  };

  test('submit le formulaire et redirige vers /admin_dashbord pour un admin', async () => {
    // Mock de la réponse admin
    authActions.login.mockImplementation((userData, navigate) => {
      return async (dispatch) => {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: {
              _id: '67d1607aafd9a86195d351f1',
              firstname: 'admin',
              lastName: 'marwan',
              email: 'marwan@gmail.com',
              role: 'admin',
            },
            msg: 'user successfully logged in',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        });
        navigate('/admin_dashbord');
      };
    });

    renderWithProviders(<SignIn />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'marwan@gmail.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: '123456789' },
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // Vérifications
    await waitFor(() => {
      expect(authActions.login).toHaveBeenCalledWith(
        { email: 'marwan@gmail.com', password: '123456789' },
        expect.any(Function)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/admin_dashbord');
    });
  });

  test('permet de remplir le formulaire et soumettre', async () => {
    // Mock de la réponse utilisateur normal
    authActions.login.mockImplementation((userData, navigate) => {
      return async (dispatch) => {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: {
              _id: '67d1607aafd9a86195d351f2',
              firstname: 'user',
              lastName: 'normal',
              email: 'user@example.com',
              role: 'user',
            },
            msg: 'user successfully logged in',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        });
        navigate('/dashboard');
      };
    });

    renderWithProviders(<SignIn />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'password123' },
    });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    // Vérifications
    await waitFor(() => {
      expect(authActions.login).toHaveBeenCalledWith(
        { email: 'user@example.com', password: 'password123' },
        expect.any(Function)
      );
    });
  });

  test("affiche un message d'alerte si Alert est présent", () => {
    const alertMessage = 'Inscription réussie';
    store = createTestStore({
      auth: {
        loading: false,
        error: null,
        Alert: alertMessage,
      },
    });

    renderWithProviders(<SignIn />);
    
    expect(screen.getByText(new RegExp(`${alertMessage}.*`, 'i'))).toBeInTheDocument();
  });
});