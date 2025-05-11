import { render, screen } from '@testing-library/react';
import Footer from './Footer'; // Chemin vers ton composant

describe('Footer Component', () => {
  test('renders footer sections', () => {
    render(<Footer />);
    
    // Vérifier que les sections "Boutique", "Société" et "Contact" sont rendues
    expect(screen.getByText('Boutique')).toBeInTheDocument();
    expect(screen.getByText('Société')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('renders correct contact information', () => {
    render(<Footer />);
    
    // Vérifier que le téléphone et l'email sont affichés
    expect(screen.getByText(/Téléphone :/)).toBeInTheDocument();
    expect(screen.getByText(/Email :/)).toBeInTheDocument();
  });

  test('renders current year in the copyright', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} Mens Boutique. Tous droits réservés.`)).toBeInTheDocument();
  });

 

  test('renders links for "Société" section', () => {
    render(<Footer />);
    
    const links = ['à propos', 'carrières', 'presse', 'responsabilité', 'affiliés'];
    links.forEach(link => {
      expect(screen.getByRole('link', { name: new RegExp(link, 'i') })).toBeInTheDocument();
    });
  });
});
