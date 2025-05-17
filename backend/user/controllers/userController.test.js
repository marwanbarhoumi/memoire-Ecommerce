const mongoose = require('mongoose');
const { deleteUser, getUsers } = require('../controllers/userController');
const User = require('../model/User');

// Mock des dépendances
jest.mock('../model/User');

describe('User Controller Unit Tests', () => {
  let req, res;

  // Réinitialisation avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      params: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  describe('deleteUser()', () => {
    it('should return 400 for invalid user ID', async () => {
      req.params.id = 'invalid-id';
      
      await deleteUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'ID utilisateur invalide'
      });
    });

    it('should return 404 when user not found', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      User.findByIdAndDelete.mockResolvedValue(null);
      
      await deleteUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur non trouvé'
      });
    });

    it('should successfully delete user', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test User'
      };
      req.params.id = mockUser._id;
      User.findByIdAndDelete.mockResolvedValue(mockUser);
      
      await deleteUser(req, res);
      
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Utilisateur supprimé avec succès',
        deletedUserId: mockUser._id
      });
    });

    it('should handle database errors', async () => {
      req.params.id = '507f1f77bcf86cd799439011';
      const mockError = new Error('Database error');
      User.findByIdAndDelete.mockRejectedValue(mockError);
      
      await deleteUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json.mock.calls[0][0]).toMatchObject({
        message: 'Erreur serveur'
      });
    });
  });

  describe('getUsers()', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', email: 'user1@test.com' },
        { _id: '2', name: 'User 2', email: 'user2@test.com' }
      ];
      
      User.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUsers)
      });
      
      await getUsers(req, res);
      
      expect(User.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 500 when no users found', async () => {
      User.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      });
      
      await getUsers(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'No users found'
      });
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database connection failed');
      User.find.mockReturnValue({
        lean: jest.fn().mockRejectedValue(mockError)
      });
      
      await getUsers(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: mockError.message
      });
    });

    it('should return empty array when no users exist', async () => {
      User.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([])
      });
      
      await getUsers(req, res);
      
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});