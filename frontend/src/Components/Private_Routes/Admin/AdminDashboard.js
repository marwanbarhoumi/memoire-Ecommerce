import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers, banUser, deleteUser } from '../../../JS/action/clientActions';
import '../../Style/Dashboards.css';
import { setAlert } from '../../../JS/action/alertAction';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector(state => state.client ?? {});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    console.log('Fetching users...');
    dispatch(getAllUsers());
  }, []);

  const handleBanUser = (userId, isBan) => {
    if (window.confirm(`Voulez-vous vraiment ${isBan ? 'bannir' : 'débannir'} cet utilisateur ?`)) {
      dispatch(banUser(userId, isBan));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        setIsDeleting(true);
        setDeletingId(userId);
        await dispatch(deleteUser(userId));
      } catch (err) {
        console.error('Erreur suppression:', err);
        dispatch(setAlert(
          err.response?.data?.message || 'Échec de la suppression', 
          'error'
        ));
      } finally {
        setIsDeleting(false);
        setDeletingId(null);
      }
    }
  };

  // Filtrage et pagination
  const filteredUsers = users?.filter(user => 
    `${user.firstname} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.toString().includes(searchTerm))
  );

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers?.length / usersPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="admin-dashboard">
      <h2>Gestion des Utilisateurs</h2>
      
      {error && (
        <div className="alert alert-danger">
          Erreur : {error}
        </div>
      )}
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom, email ou téléphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Chargement en cours...</div>
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
                {currentUsers?.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user._id} className={user.isBan ? 'banned' : ''}>
                      <td>
                        {user.img ? (
                          <img src={user.img} alt="Profile" className="user-avatar" />
                        ) : (
                          <div className="avatar-placeholder">
                            {user.firstname?.charAt(0)}{user.lastName?.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td>{user.firstname} {user.lastName}</td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.createAt)}</td>
                      <td>
                        {user.isBan ? (
                          <span className="status-banned">Banni</span>
                        ) : (
                          <span className="status-active">Actif</span>
                        )}
                      </td>
                      <td className="actions">
                        <button 
                          className={`ban-btn ${user.isBan ? 'unban' : ''}`}
                          onClick={() => handleBanUser(user._id, !user.isBan)}
                          disabled={isDeleting}
                        >
                          {user.isBan ? 'Débannir' : 'Bannir'}
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={isDeleting && deletingId === user._id}
                        >
                          {isDeleting && deletingId === user._id ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : 'Supprimer'}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || isDeleting}
              >
                Précédent
              </button>
              
              <span>Page {currentPage} sur {totalPages}</span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || isDeleting}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;