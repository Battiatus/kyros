/**
 * Routes de gestion des candidatures
 * @module routes/candidatureRoutes
 */

const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');
const { isAuth, hasRole } = require('../middlewares/auth');
const { validate, candidatureSchema } = require('../middlewares/validation');

/**
 * @swagger
 * /api/v1/applications:
 *   post:
 *     summary: Création d'une candidature
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - offre_id
 *             properties:
 *               offre_id:
 *                 type: string
 *               message_personnalise:
 *                 type: string
 *     responses:
 *       201:
 *         description: Candidature créée
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', isAuth, hasRole(['candidat']), validate(candidatureSchema), candidatureController.createCandidature);

/**
 * @swagger
 * /api/v1/applications/{id}:
 *   get:
 *     summary: Détails d'une candidature
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la candidature
 *     responses:
 *       200:
 *         description: Détails de la candidature
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Candidature non trouvée
 */
router.get('/:id', isAuth, candidatureController.getCandidature);

/**
 * @swagger
 * /api/v1/applications/{id}/status:
 *   put:
 *     summary: Mise à jour du statut d'une candidature
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la candidature
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [non_vue, vue, favori, acceptee, rejetee, entretien, contrat, embauchee]
 *               notes_recruteur:
 *                 type: string
 *               motif_refus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Candidature non trouvée
 */
router.put('/:id/status', isAuth, hasRole(['recruteur', 'admin_entreprise']), candidatureController.updateCandidatureStatus);

/**
 * @swagger
 * /api/v1/applications/me:
 *   get:
 *     summary: Mes candidatures
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page à récupérer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de candidatures par page
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [non_vue, vue, favori, acceptee, rejetee, entretien, contrat, embauchee]
 *         description: Filtre par statut
 *     responses:
 *       200:
 *         description: Liste des candidatures
 *       401:
 *         description: Non authentifié
 */
router.get('/me', isAuth, hasRole(['candidat']), candidatureController.getMyCandidatures);

/**
 * @swagger
 * /api/v1/applications/job/{offreId}:
 *   get:
 *     summary: Candidatures pour une offre
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offreId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'offre
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page à récupérer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de candidatures par page
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [non_vue, vue, favori, acceptee, rejetee, entretien, contrat, embauchee]
 *         description: Filtre par statut
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [date, score]
 *           default: date
 *         description: Champ de tri
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Ordre de tri
 *     responses:
 *       200:
 *         description: Liste des candidatures
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 */
router.get('/job/:offreId', isAuth, hasRole(['recruteur', 'admin_entreprise']), candidatureController.getOffreCandidatures);

/**
 * @swagger
 * /api/v1/applications/swipe:
 *   post:
 *     summary: Action de swipe sur une offre
 *     tags: [Candidatures]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - offre_id
 *               - action
 *             properties:
 *               offre_id:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [droite, gauche, favori]
 *               motif_rejet:
 *                 type: string
 *     responses:
 *       200:
 *         description: Action enregistrée
 *       401:
 *         description: Non authentifié
 */
router.post('/swipe', isAuth, hasRole(['candidat']), candidatureController.swipeOffre);

module.exports = router;