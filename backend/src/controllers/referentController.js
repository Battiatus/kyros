/**
 * Contrôleur de validation des références
 * @module controllers/referentController
 */

const referentService = require('../services/referentService');
const catchAsync = require('../utils/catchAsync');

/**
 * Valider une référence
 * @route GET /api/v1/references/validate
 * @group Références - Validation des expériences
 * @param {Object} req.query - Token de validation
 * @param {Object} res - Réponse Express
 * @returns {Object} Formulaire de validation
 */
exports.validateReference = catchAsync(async (req, res) => {
  const { token } = req.query;
  
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Token de validation manquant'
    });
  }
  
  const referentData = await referentService.getReferentByToken(token);
  
  res.status(200).json({
    success: true,
    data: referentData
  });
});

/**
 * Soumettre la validation d'une référence
 * @route POST /api/v1/references/validate
 * @group Références - Validation des expériences
 * @param {Object} req.body - Données de validation
 * @param {Object} res - Réponse Express
 * @returns {Object} Confirmation de validation
 */
exports.submitValidation = catchAsync(async (req, res) => {
  const { token, validation, commentaire } = req.body;
  
  const result = await referentService.submitValidation(token, validation, commentaire);
  
  res.status(200).json({
    success: true,
    message: result.validation === 'valide' ? 
      'Référence validée avec succès' : 
      'Référence refusée',
    data: result
  });
});

/**
 * Récupérer les références en attente pour un utilisateur
 * @route GET /api/v1/references/pending
 * @group Références - Validation des expériences
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Références en attente
 */
exports.getPendingReferences = catchAsync(async (req, res) => {
  const references = await referentService.getPendingReferences(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { references }
  });
});

/**
 * Relancer un référent
 * @route POST /api/v1/references/:id/remind
 * @group Références - Validation des expériences
 * @param {string} req.params.id - ID du référent
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Confirmation d'envoi
 */
exports.remindReferent = catchAsync(async (req, res) => {
  await referentService.remindReferent(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    message: 'Rappel envoyé au référent'
  });
});