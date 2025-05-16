/**
 * Contrôleur d'authentification
 * @module controllers/authController
 */

const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');

/**
 * Inscription d'un nouvel utilisateur
 * @route POST /api/v1/auth/register
 * @group Auth - Opérations d'authentification
 * @param {Object} req.body - Données d'inscription
 * @param {Object} res - Réponse Express
 * @returns {Object} Utilisateur créé
 */
exports.register = catchAsync(async (req, res) => {
  const userData = req.body;
  
  const user = await authService.register(userData);
  
  res.status(201).json({
    success: true,
    message: 'Inscription réussie. Veuillez vérifier votre email pour activer votre compte.',
    data: {
      user: user.toPublicJSON()
    }
  });
});

/**
 * Connexion d'un utilisateur
 * @route POST /api/v1/auth/login
 * @group Auth - Opérations d'authentification
 * @param {Object} req.body - Identifiants de connexion
 * @param {Object} res - Réponse Express
 * @returns {Object} Token JWT et informations utilisateur
 */
exports.login = catchAsync(async (req, res) => {
  const { email, mot_de_passe } = req.body;
  
  const auth = await authService.login(email, mot_de_passe);
  
  res.status(200).json({
    success: true,
    message: 'Connexion réussie',
    data: auth
  });
});

/**
 * Validation de l'email d'un utilisateur
 * @route GET /api/v1/auth/validate-email
 * @group Auth - Opérations d'authentification
 * @param {Object} req.query - Token de validation
 * @param {Object} res - Réponse Express
 * @returns {Object} Statut de validation
 */
exports.validateEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token manquant'
    });
  }
  
  await authService.validateEmail(token);
  
  res.status(200).json({
    success: true,
    message: 'Email validé avec succès. Vous pouvez maintenant vous connecter.'
  });
});

/**
 * Demande de réinitialisation de mot de passe
 * @route POST /api/v1/auth/forgot-password
 * @group Auth - Opérations d'authentification
 * @param {Object} req.body - Email de l'utilisateur
 * @param {Object} res - Réponse Express
 * @returns {Object} Statut de la demande
 */
exports.forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  
  await authService.forgotPassword(email);
  
  res.status(200).json({
    success: true,
    message: 'Si un compte est associé à cet email, un lien de réinitialisation a été envoyé.'
  });
});

/**
 * Réinitialisation du mot de passe
 * @route POST /api/v1/auth/reset-password
 * @group Auth - Opérations d'authentification
 * @param {Object} req.body - Token et nouveau mot de passe
 * @param {Object} res - Réponse Express
 * @returns {Object} Statut de la réinitialisation
 */
exports.resetPassword = catchAsync(async (req, res) => {
  const { token, mot_de_passe } = req.body;
  
  await authService.resetPassword(token, mot_de_passe);
  
  res.status(200).json({
    success: true,
    message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.'
  });
});

/**
 * Profil de l'utilisateur connecté
 * @route GET /api/v1/auth/me
 * @group Auth - Opérations d'authentification
 * @param {Object} req - Requête Express avec utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Informations de l'utilisateur
 */
exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user.toPublicJSON()
    }
  });
});

/**
 * Connexion via Google
 * @route GET /api/v1/auth/google
 * @group Auth - Opérations d'authentification
 */
exports.googleAuth = (req, res) => {
  // Cette route est gérée par Passport.js
};

/**
 * Callback après authentification Google
 * @route GET /api/v1/auth/google/callback
 * @group Auth - Opérations d'authentification
 */
exports.googleCallback = catchAsync(async (req, res) => {
  // Implémentation du callback à compléter avec Passport.js
  res.redirect(`${process.env.FRONTEND_URL}/login-success`);
});

/**
 * Connexion via LinkedIn
 * @route GET /api/v1/auth/linkedin
 * @group Auth - Opérations d'authentification
 */
exports.linkedinAuth = (req, res) => {
  // Cette route est gérée par Passport.js
};

/**
 * Callback après authentification LinkedIn
 * @route GET /api/v1/auth/linkedin/callback
 * @group Auth - Opérations d'authentification
 */
exports.linkedinCallback = catchAsync(async (req, res) => {
  // Implémentation du callback à compléter avec Passport.js
  res.redirect(`${process.env.FRONTEND_URL}/login-success`);
});