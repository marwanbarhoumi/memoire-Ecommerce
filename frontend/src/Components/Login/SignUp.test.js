import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import SignUp from './SignUp';
import { authReducer } from '../../JS/reducers/authReducer';
import * as authActions from '../../JS/action/authActions';

// Mock de l'action register
jest.mock('../../JS/action/authActions', () => ({
  ...jest.requireActual('../../JS/action/authActions'),
  register: jest.fn(),
}));

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('SignUp Component', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    authActions.register.mockClear();
    mockNavigate.mockClear();
  });

  const renderWithProviders = (component) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>{component}</MemoryRouter>
      </Provider>
    );
  };

  test('affiche correctement tous les champs du formulaire', () => {
    renderWithProviders(<SignUp />);
    
    // Utilisation de getByLabelText avec les textes exacts
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Numéro de téléphone')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse')).toBeInTheDocument();
    expect(screen.getByLabelText('Date de naissance')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByText('Etes-vous vendeur ?')).toBeInTheDocument();
  });

  test('affiche les erreurs de validation quand le formulaire est vide', async () => {
    renderWithProviders(<SignUp />);
    
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(screen.getByText('Le prénom est requis')).toBeInTheDocument();
      expect(screen.getByText('Le nom est requis')).toBeInTheDocument();
      expect(screen.getByText('L\'email est requis')).toBeInTheDocument();
      expect(screen.getByText('Le mot de passe est requis')).toBeInTheDocument();
      expect(screen.getByText('Le numéro de téléphone est requis')).toBeInTheDocument();
      expect(screen.getByText('L\'adresse est requise')).toBeInTheDocument();
      expect(screen.getByText('La date de naissance est requise')).toBeInTheDocument();
    });
  });

  test('permet de remplir le formulaire et soumettre (client)', async () => {
    authActions.register.mockImplementation((userData, navigate) => {
      return async (dispatch) => {
        dispatch({ type: 'REGISTER_SUCCESS' });
        navigate('/login');
      };
    });

    renderWithProviders(<SignUp />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Jean' } });
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Dupont' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jean@example.com' } });
    fireEvent.change(screen.getByLabelText('Numéro de téléphone'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('Adresse'), { target: { value: '123 Rue Test' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'Password123!' } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(authActions.register).toHaveBeenCalledWith(
        {
          firstname: 'Jean',
          lastName: 'Dupont',
          email: 'jean@example.com',
          phone: '12345678',
          adresse: '123 Rue Test',
          birthDate: '1990-01-01',
          password: 'Password123!',
          role: 'client',
        },
        expect.any(Function)
      );
    });
  });

  test('permet de remplir le formulaire et soumettre (vendeur)', async () => {
    authActions.register.mockImplementation((userData, navigate) => {
      return async (dispatch) => {
        dispatch({ type: 'REGISTER_SUCCESS' });
        navigate('/login');
      };
    });

    renderWithProviders(<SignUp />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText('Prénom'), { target: { value: 'Marie' } });
    fireEvent.change(screen.getByLabelText('Nom'), { target: { value: 'Martin' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'marie@example.com' } });
    fireEvent.change(screen.getByLabelText('Numéro de téléphone'), { target: { value: '87654321' } });
    fireEvent.change(screen.getByLabelText('Adresse'), { target: { value: '456 Avenue Test' } });
    fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { value: '1985-05-15' } });
    fireEvent.change(screen.getByLabelText('Mot de passe'), { target: { value: 'Password456!' } });
    
    // Cocher la case vendeur
    fireEvent.click(screen.getByRole('checkbox'));

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole('button', { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(authActions.register).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'seller',
        }),
        expect.any(Function)
      );
    });
  });

  test('gère correctement le changement de rôle via la checkbox', () => {
    renderWithProviders(<SignUp />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });


});