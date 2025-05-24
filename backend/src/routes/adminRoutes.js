/**
 * Routes d'administration
 * @module routes/adminRoutes
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuth, hasRole } = require('../middlewares/auth');

// Toutes les routes admin nécessitent le rôle admin_plateforme
router.use(isAuth, hasRole(['admin_plateforme']));

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     summary: Statistiques globales
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date_debut
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: date_fin
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Statistiques globales
 *       403:
 *         description: Accès refusé
 */
router.get('/stats', adminController.getGlobalStats);

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Liste des utilisateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/users', adminController.getUsers);

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   get:
 *     summary: Détails d'un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 */
router.get('/users/:id', adminController.getUserDetails);

/**
 * @swagger
 * /api/v1/admin/users/{id}/moderate:
 *   put:
 *     summary: Modérer un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [suspendre, reactiver, supprimer]
 *               motif:
 *                 type: string
 *     responses:
 *       200:
 *         description: Action de modération effectuée
 */
router.put('/users/:id/moderate', adminController.moderateUser);

/**
 * @swagger
 * /api/v1/admin/companies:
 *   get:
 *     summary: Liste des entreprises
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des entreprises
 */
router.get('/companies', adminController.getCompanies);

/**
 * @swagger
 * /api/v1/admin/companies/{id}:
 *   get:
 *     summary: Détails d'une entreprise
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'entreprise
 */
router.get('/companies/:id', adminController.getCompanyDetails);

/**
 * @swagger
 * /api/v1/admin/jobs:
 *   get:
 *     summary: Liste des offres
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des offres
 */
router.get('/jobs', adminController.getJobs);

/**
 * @swagger
 * /api/v1/admin/payments:
 *   get:
 *     summary: Historique des paiements
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique des paiements
 */
router.get('/payments', adminController.getPayments);

/**
 * @swagger
 * /api/v1/admin/analytics:
 *   get:
 *     summary: Données d'analytics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periode
 *         schema:
 *           type: string
 *           default: 30d
 *     responses:
 *       200:
 *         description: Données pour graphiques
 */
router.get('/analytics', adminController.getAnalytics);

/**
 * @swagger
 * /api/v1/admin/export/{type}:
 *   get:
 *     summary: Exporter des données
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users, companies, payments]
 *     responses:
 *       200:
 *         description: Fichier CSV
 */
router.get('/export/:type', adminController.exportData);

module.exports = router;