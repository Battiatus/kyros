/**
 * Middleware d'authentification et d'autorisation
 * @module middlewares/auth
 */

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

/**
 * Vérifie si l'utilisateur est authentifié
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Function suivante Express
 * @returns {Promise<void>}
 */
exports.isAuth = async (req, res, next) => {
  try {
    // Extraction du token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentification requise' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérification du token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Récupération de l'utilisateur
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Ajout de l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalide' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    
    return res.status(500).json({ message: 'Erreur du serveur' });
  }
};

/**
 * Vérifie que l'utilisateur a un rôle spécifique
 * @param {string[]} roles - Rôles autorisés
 * @returns {Function} - Middleware Express
 */
exports.hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès refusé. Vous n\'avez pas les droits nécessaires.' 
      });
    }
    
    next();
  };
};

/**
 * Vérifie que l'utilisateur appartient bien à l'entreprise
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Function suivante Express
 * @returns {Promise<void>}
 */
exports.isCompanyMember = async (req, res, next) => {
  try {
    const { entrepriseId } = req.params;
    
    if (!req.user.entreprise_id || req.user.entreprise_id.toString() !== entrepriseId) {
      return res.status(403).json({
        message: 'Accès refusé. Vous n\'appartenez pas à cette entreprise.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Erreur du serveur' });
  }
};

/**
 * Vérifie si l'utilisateur est l'administrateur de l'entreprise
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Function suivante Express
 * @returns {Promise<void>}
 */
exports.isCompanyAdmin = async (req, res, next) => {
  try {
    const { entrepriseId } = req.params;
    
    if (req.user.role !== 'admin_entreprise') {
      return res.status(403).json({
        message: 'Accès refusé. Vous n\'êtes pas administrateur d\'entreprise.'
      });
    }
    
    if (!req.user.entreprise_id || req.user.entreprise_id.toString() !== entrepriseId) {
      return res.status(403).json({
        message: 'Accès refusé. Vous n\'êtes pas l\'administrateur de cette entreprise.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Erreur du serveur' });
  }
};