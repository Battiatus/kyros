/**
 * Contrôleur de gestion des paiements
 * @module controllers/paymentController
 */

const paymentService = require('../services/paymentService');
const catchAsync = require('../utils/catchAsync');

/**
 * Créer une session de paiement
 * @route POST /api/v1/payments/create-session
 * @group Paiements - Opérations de paiement
 * @param {Object} req.body - Données du paiement
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Session de paiement
 */
exports.createPaymentSession = catchAsync(async (req, res) => {
  const { type, duree, plan } = req.body;
  
  const session = await paymentService.createPaymentSession(
    req.user._id,
    type,
    duree,
    plan
  );
  
  res.status(200).json({
    success: true,
    data: { sessionUrl: session.url, sessionId: session.id }
  });
});

/**
 * Vérifier le statut d'un paiement
 * @route GET /api/v1/payments/status/:sessionId
 * @group Paiements - Opérations de paiement
 * @param {string} req.params.sessionId - ID de la session
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Statut du paiement
 */
exports.getPaymentStatus = catchAsync(async (req, res) => {
  const status = await paymentService.getPaymentStatus(req.params.sessionId);
  
  res.status(200).json({
    success: true,
    data: { status }
  });
});

/**
 * Historique des paiements de l'utilisateur
 * @route GET /api/v1/payments/history
 * @group Paiements - Opérations de paiement
 * @param {Object} req.query - Paramètres de pagination
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Historique des paiements
 */
exports.getPaymentHistory = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const result = await paymentService.getUserPaymentHistory(
    req.user._id,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.payments,
    pagination: result.pagination
  });
});

/**
 * Annuler un abonnement
 * @route POST /api/v1/payments/cancel-subscription
 * @group Paiements - Opérations de paiement
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Confirmation d'annulation
 */
exports.cancelSubscription = catchAsync(async (req, res) => {
  await paymentService.cancelUserSubscription(req.user._id);
  
  res.status(200).json({
    success: true,
    message: 'Abonnement annulé avec succès'
  });
});

/**
 * Webhook Stripe
 * @route POST /api/v1/payments/webhook
 * @group Paiements - Opérations de paiement
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @returns {Object} Confirmation de traitement
 */
exports.stripeWebhook = catchAsync(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  await paymentService.handleStripeWebhook(req.body, signature);
  
  res.status(200).json({ received: true });
});

/**
 * Récupérer les plans disponibles
 * @route GET /api/v1/payments/plans
 * @group Paiements - Opérations de paiement
 * @param {Object} res - Réponse Express
 * @returns {Object} Plans disponibles
 */
exports.getPlans = catchAsync(async (req, res) => {
  const plans = await paymentService.getAvailablePlans();
  
  res.status(200).json({
    success: true,
    data: { plans }
  });
});