/**
 * Routes d'authentification
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validate, registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middlewares/validation');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - mot_de_passe
 *               - confirmation_mot_de_passe
 *               - role
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telephone:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *                 format: password
 *               confirmation_mot_de_passe:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [candidat, recruteur]
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - mot_de_passe
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               mot_de_passe:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Authentification échouée
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/v1/auth/validate-email:
 *   get:
 *     summary: Validation de l'email d'un utilisateur
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token de validation
 *     responses:
 *       200:
 *         description: Email validé avec succès
 *       400:
 *         description: Token invalide ou expiré
 */
router.get('/validate-email', authController.validateEmail);

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé (si compte existe)
 */
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Réinitialisation du mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - mot_de_passe
 *               - confirmation_mot_de_passe
 *             properties:
 *               token:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *                 format: password
 *               confirmation_mot_de_passe:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 */
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get('/me', isAuth, authController.getMe);

/**
 * @swagger
 * /api/v1/auth/google:
 *   get:
 *     summary: Connexion via Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers Google
 */
router.get('/google', authController.googleAuth);

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Callback après authentification Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers l'application
 */
router.get('/google/callback', authController.googleCallback);

/**
 * @swagger
 * /api/v1/auth/linkedin:
 *   get:
 *     summary: Connexion via LinkedIn
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers LinkedIn
 */
router.get('/linkedin', authController.linkedinAuth);

/**
 * @swagger
 * /api/v1/auth/linkedin/callback:
 *   get:
 *     summary: Callback après authentification LinkedIn
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers l'application
 */
router.get('/linkedin/callback', authController.linkedinCallback);

module.exports = router;