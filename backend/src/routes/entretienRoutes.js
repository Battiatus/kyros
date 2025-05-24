/**
 * Routes de gestion des entretiens
 * @module routes/entretienRoutes
 */

const express = require('express');
const router = express.Router();
const entretienController = require('../controllers/entretienController');
const { isAuth, hasRole } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/interviews:
 *   post:
 *     summary: Créer un entretien
 *     tags: [Entretiens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidature_id
 *               - date_entretien
 *               - mode
 *             properties:
 *               candidature_id:
 *                 type: string
 *               date_entretien:
 *                 type: string
 *                 format: date-time
 *               duree:
 *                 type: integer
 *               mode:
 *                 type: string
 *                 enum: [visio, physique]
 *               lieu:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Entretien créé
 */
router.post('/', isAuth, hasRole(['recruteur', 'admin_entreprise']), entretienController.createEntretien);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   get:
 *     summary: Récupérer un entretien
 *     tags: [Entretiens]
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
 *         description: Détails de l'entretien
 */
router.get('/:id', isAuth, entretienController.getEntretien);

/**
 * @swagger
 * /api/v1/interviews/{id}:
 *   put:
 *     summary: Mettre à jour un entretien
 *     tags: [Entretiens]
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
 *         description: Entretien mis à jour
 */
router.put('/:id', isAuth, hasRole(['recruteur', 'admin_entreprise']), entretienController.updateEntretien);

/**
 * @swagger
 * /api/v1/interviews/{id}/confirm:
 *   put:
 *     summary: Confirmer un entretien
 *     tags: [Entretiens]
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
 *         description: Entretien confirmé
 */
router.put('/:id/confirm', isAuth, entretienController.confirmEntretien);

/**
 * @swagger
 * /api/v1/interviews/{id}/cancel:
 *   put:
 *     summary: Annuler un entretien
 *     tags: [Entretiens]
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
 *         description: Entretien annulé
 */
router.put('/:id/cancel', isAuth, entretienController.cancelEntretien);

/**
 * @swagger
 * /api/v1/interviews/me:
 *   get:
 *     summary: Mes entretiens
 *     tags: [Entretiens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des entretiens
 */
router.get('/me', isAuth, entretienController.getMyEntretiens);

/**
 * @swagger
 * /api/v1/interviews/{id}/video-link:
 *   post:
 *     summary: Générer un lien de visioconférence
 *     tags: [Entretiens]
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
 *         description: Lien généré
 */
router.post('/:id/video-link', isAuth, entretienController.generateVideoLink);

module.exports = router;