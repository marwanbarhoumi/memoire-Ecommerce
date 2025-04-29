import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsers, banUser, deleteUser } from '../../../JS/action/clientActions';
import '../../Style/Dashboards.css';
import { setAlert } from '../../../JS/action/alertAction'; 

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users = [], loading } = useSelector(state => state.client ?? {});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const fullState = useSelector(state => state);
  console.log('État complet Redux:', fullState);
  // Fonctions de gestion
  const handleBanUser = (userId, isBan) => {
    if (window.confirm(`Voulez-vous vraiment ${isBan ? 'bannir' : 'débannir'} cet utilisateur ?`)) {
      dispatch(banUser(userId, isBan));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await dispatch(deleteUser(userId));
        // Notification de succès
        dispatch(setAlert('Utilisateur supprimé avec succès', 'success'));
      } catch (err) {
        // L'erreur est déjà gérée dans l'action
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
                        >
                          {user.isBan ? 'Débannir' : 'Bannir'}
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user._id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              
              <span>Page {currentPage} sur {totalPages}</span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
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