/**
 * Routes de validation des références
 * @module routes/referentRoutes
 */

const express = require('express');
const router = express.Router();
const referentController = require('../controllers/referentController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/references/validate:
 *   get:
 *     summary: Récupérer les données pour validation d'une référence
 *     tags: [Références]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de validation
 *     responses:
 *       200:
 *         description: Données de la référence à valider
 *       400:
 *         description: Token invalide
 */
router.get('/validate', referentController.validateReference);

/**
 * @swagger
 * /api/v1/references/validate:
 *   post:
 *     summary: Soumettre la validation d'une référence
 *     tags: [Références]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - validation
 *             properties:
 *               token:
 *                 type: string
 *               validation:
 *                 type: string
 *                 enum: [valide, refuse]
 *               commentaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Validation enregistrée
 */
router.post('/validate', referentController.submitValidation);

/**
 * @swagger
 * /api/v1/references/pending:
 *   get:
 *     summary: Références en attente de l'utilisateur
 *     tags: [Références]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des références en attente
 */
router.get('/pending', isAuth, referentController.getPendingReferences);

/**
 * @swagger
 * /api/v1/references/{id}/remind:
 *   post:
 *     summary: Relancer un référent
 *     tags: [Références]
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
 *         description: Rappel envoyé
 */
router.post('/:id/remind', isAuth, referentController.remindReferent);

module.exports = router;