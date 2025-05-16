/**
 * Routes de gestion des offres d'emploi
 * @module routes/offreRoutes
 */

const express = require('express');
const router = express.Router();
const offreController = require('../controllers/offreController');
const { isAuth, hasRole } = require('../middlewares/auth');
const { validate, createOffreSchema } = require('../middlewares/validation');

/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Création d'une nouvelle offre
 *     tags: [Offres]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOffre'
 *     responses:
 *       201:
 *         description: Offre créée avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 */
router.post('/', isAuth, hasRole(['recruteur', 'admin_entreprise']), validate(createOffreSchema), offreController.createOffre);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Détails d'une offre
 *     tags: [Offres]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'offre
 *     responses:
 *       200:
 *         description: Détails de l'offre
 *       404:
 *         description: Offre non trouvée
 */
router.get('/:id', offreController.getOffre);

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Mise à jour d'une offre
 *     tags: [Offres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'offre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOffre'
 *     responses:
 *       200:
 *         description: Offre mise à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Offre non trouvée
 */
router.put('/:id', isAuth, hasRole(['recruteur', 'admin_entreprise']), offreController.updateOffre);

/**
 * @swagger
 * /api/v1/jobs/{id}/close:
 *   put:
 *     summary: Clôture d'une offre
 *     tags: [Offres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'offre
 *     responses:
 *       200:
 *         description: Offre clôturée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Offre non trouvée
 */
router.put('/:id/close', isAuth, hasRole(['recruteur', 'admin_entreprise']), offreController.closeOffre);

/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: Recherche d'offres
 *     tags: [Offres]
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
 *         description: Nombre d'offres par page
 *       - in: query
 *         name: localisation
 *         schema:
 *           type: string
 *         description: Filtre par localisation
 *       - in: query
 *         name: type_contrat
 *         schema:
 *           type: string
 *           enum: [cdi, cdd, stage, freelance, autre]
 *         description: Filtre par type de contrat
 *       - in: query
 *         name: remote
 *         schema:
 *           type: string
 *           enum: [non, hybride, full_remote]
 *         description: Filtre par modalité de travail
 *     responses:
 *       200:
 *         description: Liste des offres
 */
router.get('/', offreController.searchOffres);

/**
 * @swagger
 * /api/v1/jobs/suggested:
 *   get:
 *     summary: Offres suggérées pour le candidat
 *     tags: [Offres]
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
 *         description: Nombre d'offres par page
 *     responses:
 *       200:
 *         description: Liste des offres suggérées
 *       401:
 *         description: Non authentifié
 */
router.get('/suggested', isAuth, hasRole(['candidat']), offreController.getSuggestedOffres);

/**
 * @swagger
 * /api/v1/jobs/{id}/stats:
 *   get:
 *     summary: Statistiques d'une offre
 *     tags: [Offres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'offre
 *     responses:
 *       200:
 *         description: Statistiques de l'offre
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Offre non trouvée
 */
router.get('/:id/stats', isAuth, hasRole(['recruteur', 'admin_entreprise']), offreController.getOffreStats);

/**
 * @swagger
 * /api/v1/jobs/{id}/optimize:
 *   post:
 *     summary: Optimisation IA d'une offre
 *     tags: [Offres]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'offre
 *     responses:
 *       200:
 *         description: Offre optimisée
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Offre non trouvée
 */
router.post('/:id/optimize', isAuth, hasRole(['recruteur', 'admin_entreprise']), offreController.optimizeOffre);

module.exports = router;