const mongoose = require('mongoose'); // Ajout de l'import manquant
const User = require('../model/User');

exports.deleteUser = async (req, res) => {
  try {
    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({ 
      success: true,
      message: 'Utilisateur supprimé avec succès',//barhoumi
      deletedUserId: user._id
    });
    
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      message: 'Erreur serveur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    if (!users) throw new Error("No users found"); // ← Testez cette ligne
    res.json(users); // ← S'assurer qu'il y a bien une réponse
  } catch (err) {
    console.error(err);
    res.status(500).json({error: err.message});
  }
};