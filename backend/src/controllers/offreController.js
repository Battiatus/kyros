/**
 * Contrôleur de gestion des offres
 * @module controllers/offreController
 */

const offreService = require('../services/offreService');
const matchingService = require('../services/matchingService');
const catchAsync = require('../utils/catchAsync');
const MatchingService = require('../services/matchingService');


/**
 * Création d'une nouvelle offre
 * @route POST /api/v1/jobs
 * @group Offres - Opérations sur les offres d'emploi
 * @param {Object} req.body - Données de l'offre
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Offre créée
 */
exports.createOffre = catchAsync(async (req, res) => {
  const offre = await offreService.createOffre(req.body, req.user);
  
  res.status(201).json({
    success: true,
    message: 'Offre créée avec succès',
    data: { offre }
  });
});

/**
 * Récupération d'une offre par ID
 * @route GET /api/v1/jobs/:id
 * @group Offres - Opérations sur les offres d'emploi
 * @param {string} req.params.id - ID de l'offre
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails de l'offre
 */
exports.getOffre = catchAsync(async (req, res) => {
  const offre = await offreService.getOffreById(req.params.id);
  
  // Incrémenter le compteur de vues
  await offreService.incrementViews(req.params.id);
  
  res.status(200).json({
    success: true,
    data: { offre }
  });
});

/**
 * Mise à jour d'une offre
 * @route PUT /api/v1/jobs/:id
 * @group Offres - Opérations sur les offres d'emploi
 * @param {string} req.params.id - ID de l'offre
 * @param {Object} req.body - Données à mettre à jour
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Offre mise à jour
 */
exports.updateOffre = catchAsync(async (req, res) => {
  const offre = await offreService.updateOffre(req.params.id, req.body, req.user);
  
  res.status(200).json({
    success: true,
    message: 'Offre mise à jour avec succès',
    data: { offre }
  });
});

/**
 * Clôture d'une offre
 * @route PUT /api/v1/jobs/:id/close
 * @group Offres - Opérations sur les offres d'emploi
 * @param {string} req.params.id - ID de l'offre
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Offre mise à jour
 */
exports.closeOffre = catchAsync(async (req, res) => {
  const offre = await offreService.changeOffreStatus(req.params.id, 'fermee', req.user);
  
  res.status(200).json({
    success: true,
    message: 'Offre clôturée avec succès',
    data: { offre }
  });
});

/**
 * Recherche d'offres avec filtres
 * @route GET /api/v1/jobs
 * @group Offres - Opérations sur les offres d'emploi
 * @param {Object} req.query - Filtres et pagination
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste d'offres paginée
 */
exports.searchOffres = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  
  const result = await offreService.searchOffres(
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.offres,
    pagination: result.pagination
  });
});

/**
 * Offres suggérées pour un candidat
 * @route GET /api/v1/jobs/suggested
 * @group Offres - Opérations sur les offres d'emploi
 * @param {Object} req.query - Filtres et pagination
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste d'offres suggérées
 */
exports.getSuggestedOffres = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  
  const result = await matchingService.getSuggestedOffres(
    req.user._id,
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.suggestions,
    pagination: result.pagination
  });
});

/**
 * Statistiques d'une offre
 * @route GET /api/v1/jobs/:id/stats
 * @group Offres - Opérations sur les offres d'emploi
 * @param {string} req.params.id - ID de l'offre
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Statistiques de l'offre
 */
exports.getOffreStats = catchAsync(async (req, res) => {
  const stats = await offreService.getOffreStats(req.params.id);
  
  res.status(200).json({
    success: true,
    data: { stats }
  });
});

/**
 * Optimisation d'une offre avec l'IA
 * @route POST /api/v1/jobs/:id/optimize
 * @group Offres - Opérations sur les offres d'emploi
 * @param {string} req.params.id - ID de l'offre
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Offre optimisée
 */
exports.optimizeOffre = catchAsync(async (req, res) => {
  const offre = await offreService.optimizeOffre(req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Offre optimisée avec succès',
    data: { offre }
  });
});