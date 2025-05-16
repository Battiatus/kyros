/**
 * Contrôleur de gestion des candidatures
 * @module controllers/candidatureController
 */

const candidatureService = require('../services/candidatureService');
const matchingService = require('../services/matchingService');
const catchAsync = require('../utils/catchAsync');

/**
 * Créer une nouvelle candidature
 * @route POST /api/v1/applications
 * @group Candidatures - Opérations sur les candidatures
 * @param {Object} req.body - Données de la candidature
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Candidature créée
 */
exports.createCandidature = catchAsync(async (req, res) => {
  const candidature = await candidatureService.createCandidature(req.body, req.user);
  
  res.status(201).json({
    success: true,
    message: 'Candidature envoyée avec succès',
    data: { candidature }
  });
});

/**
 * Récupérer une candidature par ID
 * @route GET /api/v1/applications/:id
 * @group Candidatures - Opérations sur les candidatures
 * @param {string} req.params.id - ID de la candidature
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails de la candidature
 */
exports.getCandidature = catchAsync(async (req, res) => {
  const candidature = await candidatureService.getCandidatureById(req.params.id);
  
  res.status(200).json({
    success: true,
    data: { candidature }
  });
});

/**
 * Mettre à jour le statut d'une candidature
 * @route PUT /api/v1/applications/:id/status
 * @group Candidatures - Opérations sur les candidatures
 * @param {string} req.params.id - ID de la candidature
 * @param {Object} req.body - Nouveau statut et données
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Candidature mise à jour
 */
exports.updateCandidatureStatus = catchAsync(async (req, res) => {
  const { statut, notes_recruteur, motif_refus } = req.body;
  
  const candidature = await candidatureService.updateCandidatureStatus(
    req.params.id,
    statut,
    { notes_recruteur, motif_refus },
    req.user
  );
  
  res.status(200).json({
    success: true,
    message: 'Statut de candidature mis à jour avec succès',
    data: { candidature }
  });
});

/**
 * Récupérer les candidatures d'un utilisateur
 * @route GET /api/v1/applications/me
 * @group Candidatures - Opérations sur les candidatures
 * @param {Object} req.query - Filtres et pagination
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des candidatures
 */
exports.getMyCandidatures = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  
  const result = await candidatureService.getUserCandidatures(
    req.user._id,
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.candidatures,
    pagination: result.pagination
  });
});

/**
 * Récupérer les candidatures pour une offre
 * @route GET /api/v1/applications/job/:offreId
 * @group Candidatures - Opérations sur les candidatures
 * @param {string} req.params.offreId - ID de l'offre
 * @param {Object} req.query - Filtres, tri et pagination
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des candidatures
 */
exports.getOffreCandidatures = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, sort_by = 'date', sort_order = 'desc', ...filters } = req.query;
  
  const result = await candidatureService.getOffreCandidatures(
    req.params.offreId,
    filters,
    { field: sort_by, order: sort_order },
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.candidatures,
    pagination: result.pagination
  });
});

/**
 * Enregistrer une action de swipe
 * @route POST /api/v1/applications/swipe
 * @group Candidatures - Opérations sur les candidatures
 * @param {Object} req.body - Données de swipe
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat de l'action
 */
exports.swipeOffre = catchAsync(async (req, res) => {
  const { offre_id, action, motif_rejet } = req.body;
  
  const result = await matchingService.recordSwipeAction(
    req.user._id,
    offre_id,
    action,
    motif_rejet
  );
  
  let message = 'Action enregistrée';
  
  if (action === 'droite') {
    message = 'Candidature envoyée avec succès';
  } else if (action === 'favori') {
    message = 'Offre ajoutée aux favoris';
  }
  
  res.status(200).json({
    success: true,
    message,
    data: { result }
  });
});