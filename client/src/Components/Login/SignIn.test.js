import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import SignIn from './SignIn';
import authReducer from '../../JS/reducers/authReducer';

// Mock pour les actions Redux
jest.mock('../../JS/action/authActions', () => ({
  login: jest.fn(() => ({ type: 'LOGIN' }))
}));

// Configuration d'un store Redux mocké
const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    preloadedState
  });
};

describe('SignIn Component', () => {
  let store;
  const mockNavigate = jest.fn();

  beforeEach(() => {
    store = setupStore({
      auth: {
        Alert: null,
        isAuth: false,
        user: null,
        loading: false
      }
    });

    // Mock de useNavigate
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
    expect(screen.getByText(/Vous n'avez pas de compte/)).toBeInTheDocument();
  });

  test('shows alert message when alertMessage exists in state', () => {
    const alertStore = setupStore({
      auth: {
        Alert: 'Inscription réussie',
        isAuth: false,
        user: null,
        loading: false
      }
    });

    render(
      <Provider store={alertStore}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Inscription réussie/)).toBeInTheDocument();
  });

  test('updates email and password fields when user types', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('submits form with correct data', async () => {
    const { login } = require('../../JS/action/authActions');
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Mot de passe');
    const submitButton = screen.getByRole('button', { name: 'Se connecter' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        expect.any(Function) // navigate function
      );
    });
  });

  test('shows validation errors when submitting empty form', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: 'Se connecter' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('aria-invalid', 'true');
    });
  });
});