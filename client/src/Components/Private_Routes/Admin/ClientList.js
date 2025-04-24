import React, { useEffect, useState, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers, banUser, deleteUser } from '../../../JS/action/clientActions';
import '../../Style/Dashboards.css';
import { setAlert } from '../../../JS/action/alertAction';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-fallback">Une erreur s'est produite. Veuillez recharger la page.</div>;
    }
    return this.props.children;
  }
}

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const clientState = useSelector(state => state.client || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Safely get users array
  const users = Array.isArray(clientState.users) ? clientState.users : [];
  const loading = Boolean(clientState.loading);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        await dispatch(getAllUsers());
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    };

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleBanUser = async (userId, isBan) => {
    try {
      await dispatch(banUser(userId, isBan));
    } catch (error) {
      dispatch(setAlert('Erreur lors de la modification du statut', 'error'));
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await dispatch(deleteUser(userId));
      dispatch(setAlert('Utilisateur supprimé avec succès', 'success'));
      // Reset to first page after deletion
      setCurrentPage(1);
    } catch (error) {
      dispatch(setAlert('Erreur lors de la suppression', 'error'));
    }
  };

  // Memoized filtered users
  const filteredUsers = React.useMemo(() => {
    return users.filter(user => {
      if (!user || !user._id) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${user.firstname || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const phone = (user.phone || '').toString();
      
      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchTerm)
      );
    });
  }, [users, searchTerm]);

  // Memoized pagination
  const { paginatedUsers, totalPages } = React.useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const slicedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const pages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage));
    
    return {
      paginatedUsers: slicedUsers,
      totalPages: pages
    };
  }, [filteredUsers, currentPage, usersPerPage]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('fr-FR');
    } catch {
      return 'N/A';
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <ErrorBoundary>
      <div className="admin-dashboard">
        <h2>Gestion des Utilisateurs</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <Suspense fallback={<div className="loading">Chargement...</div>}>
          {loading ? (
            <div className="loading">Chargement des données...</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Rôle</th>
                      <th>Inscription</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <tr key={user._id} className={user.isBan ? 'banned' : ''}>
                          <td>
                            {user?.img ? (
                              <img 
                                src={user.img} 
                                alt={`${user.firstname || ''} ${user.lastName || ''}`}
                                className="user-avatar"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/default-avatar.png';
                                }}
                              />
                            ) : (
                              <div className="avatar-placeholder">
                                {`${user?.firstname?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`}
                              </div>
                            )}
                          </td>
                          <td>{user?.firstname || ''} {user?.lastName || ''}</td>
                          <td>{user?.email || '-'}</td>
                          <td>{user?.phone || '-'}</td>
                          <td>
                            <span className={`role-badge ${user?.role || 'user'}`}>
                              {user?.role || 'user'}
                            </span>
                          </td>
                          <td>{formatDate(user?.createdAt)}</td>
                          <td>
                            {user?.isBan ? (
                              <span className="status-banned">Banni</span>
                            ) : (
                              <span className="status-active">Actif</span>
                            )}
                          </td>
                          <td className="actions">
                            <button
                              className={`ban-btn ${user?.isBan ? 'unban' : ''}`}
                              onClick={() => handleBanUser(user._id, !user.isBan)}
                              disabled={!user?._id}
                            >
                              {user?.isBan ? 'Débannir' : 'Bannir'}
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={!user?._id}
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
                  
                  <span>Page {currentPage} sur {totalPages}</span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;