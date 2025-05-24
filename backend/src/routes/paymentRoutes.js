/**
 * Routes de gestion des paiements
 * @module routes/paymentRoutes
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/payments/plans:
 *   get:
 *     summary: Récupérer les plans disponibles
 *     tags: [Paiements]
 *     responses:
 *       200:
 *         description: Plans disponibles
 */
router.get('/plans', paymentController.getPlans);

/**
 * @swagger
 * /api/v1/payments/create-session:
 *   post:
 *     summary: Créer une session de paiement
 *     tags: [Paiements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - duree
 *               - plan
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [abonnement_candidat, boost_candidat, forfait_entreprise]
 *               duree:
 *                 type: integer
 *               plan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Session de paiement créée
 */
router.post('/create-session', isAuth, paymentController.createPaymentSession);

/**
 * @swagger
 * /api/v1/payments/status/{sessionId}:
 *   get:
 *     summary: Vérifier le statut d'un paiement
 *     tags: [Paiements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du paiement
 */
router.get('/status/:sessionId', isAuth, paymentController.getPaymentStatus);

/**
 * @swagger
 * /api/v1/payments/history:
 *   get:
 *     summary: Historique des paiements
 *     tags: [Paiements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique des paiements
 */
router.get('/history', isAuth, paymentController.getPaymentHistory);

/**
 * @swagger
 * /api/v1/payments/cancel-subscription:
 *   post:
 *     summary: Annuler un abonnement
 *     tags: [Paiements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Abonnement annulé
 */
router.post('/cancel-subscription', isAuth, paymentController.cancelSubscription);

/**
 * @swagger
 * /api/v1/payments/webhook:
 *   post:
 *     summary: Webhook Stripe
 *     tags: [Paiements]
 *     responses:
 *       200:
 *         description: Webhook traité
 */
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

module.exports = router;