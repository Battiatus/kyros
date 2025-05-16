/**
 * Service d'authentification
 * @module services/authService
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Entreprise = require('../models/Entreprise');
const emailService = require('./emailService');
const config = require('../config/config');

/**
 * Enregistre un nouvel utilisateur
 * @param {Object} userData - Données de l'utilisateur
 * @returns {Promise<Object>} Utilisateur créé
 */
exports.register = async (userData) => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('Un utilisateur avec cet email existe déjà');
  }
  
  // Créer l'utilisateur
  const user = new User({
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email,
    telephone: userData.telephone,
    mot_de_passe: userData.mot_de_passe,
    role: userData.role,
    validation_email: false
  });
  
  // Générer un token pour valider l'email
  const token = crypto.randomBytes(20).toString('hex');
  user.reset_token = token;
  user.reset_token_expiration = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
  
  await user.save();
  
  // Envoyer l'email de validation
  await emailService.sendEmailValidation(user.email, token);
  
  return user;
};

/**
 * Auto-assigne l'utilisateur à son entreprise si le domaine email correspond
 * @param {Object} user - Utilisateur
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
exports.autoAssignToCompany = async (user) => {
  if (user.role === 'recruteur' || user.role === 'admin_entreprise') {
    const emailDomain = user.email.split('@')[1];
    
    const entreprise = await Entreprise.findOne({ domaine_email: emailDomain });
    if (entreprise) {
      user.entreprise_id = entreprise._id;
      await user.save();
    }
  }
  
  return user;
};

/**
 * Authentifie un utilisateur
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Données de connexion avec token
 */
exports.login = async (email, password) => {
  // Trouver l'utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  // Vérifier le mot de passe
  const isValid = await user.verifyPassword(password);
  if (!isValid) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  // Vérifier la validation de l'email
  if (!user.validation_email) {
    throw new Error('Veuillez valider votre email avant de vous connecter');
  }
  
  // Mettre à jour la dernière connexion
  user.derniere_connexion = new Date();
  await user.save();
  
  // Générer le token JWT
  const token = jwt.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
  
  return {
    token,
    user: user.toPublicJSON()
  };
};

/**
 * Valide l'email d'un utilisateur
 * @param {string} token - Token de validation
 * @returns {Promise<Object>} Utilisateur validé
 */
exports.validateEmail = async (token) => {
  const user = await User.findOne({
    reset_token: token,
    reset_token_expiration: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new Error('Token invalide ou expiré');
  }
  
  user.validation_email = true;
  user.reset_token = undefined;
  user.reset_token_expiration = undefined;
  
  await user.save();
  
  return user;
};

/**
 * Initie le processus de réinitialisation de mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<void>}
 */
exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Aucun compte associé à cet email');
  }
  
  // Générer un token
  const token = crypto.randomBytes(20).toString('hex');
  user.reset_token = token;
  user.reset_token_expiration = Date.now() + 1 * 60 * 60 * 1000; // 1 heure
  
  await user.save();
  
  // Envoyer l'email de réinitialisation
  await emailService.sendPasswordReset(user.email, token);
};

/**
 * Réinitialise le mot de passe d'un utilisateur
 * @param {string} token - Token de réinitialisation
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
exports.resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    reset_token: token,
    reset_token_expiration: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new Error('Token invalide ou expiré');
  }
  
  user.mot_de_passe = newPassword;
  user.reset_token = undefined;
  user.reset_token_expiration = undefined;
  
  await user.save();
  
  return user;
};