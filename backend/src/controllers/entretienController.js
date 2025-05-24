/**
 * Contrôleur de gestion des entretiens
 * @module controllers/entretienController
 */

const entretienService = require('../services/entretienService');
const catchAsync = require('../utils/catchAsync');

/**
 * Créer un entretien
 * @route POST /api/v1/interviews
 * @group Entretiens - Opérations sur les entretiens
 * @param {Object} req.body - Données de l'entretien
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Entretien créé
 */
exports.createEntretien = catchAsync(async (req, res) => {
  const entretien = await entretienService.createEntretien(req.body, req.user);
  
  res.status(201).json({
    success: true,
    message: 'Entretien planifié avec succès',
    data: { entretien }
  });
});

/**
 * Récupérer un entretien par ID
 * @route GET /api/v1/interviews/:id
 * @group Entretiens - Opérations sur les entretiens
 * @param {string} req.params.id - ID de l'entretien
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails de l'entretien
 */
exports.getEntretien = catchAsync(async (req, res) => {
  const entretien = await entretienService.getEntretienById(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    data: { entretien }
  });
});

/**
 * Mettre à jour un entretien
 * @route PUT /api/v1/interviews/:id
 * @group Entretiens - Opérations sur les entretiens
 * @param {string} req.params.id - ID de l'entretien
 * @param {Object} req.body - Données à mettre à jour
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Entretien mis à jour
 */
exports.updateEntretien = catchAsync(async (req, res) => {
  const entretien = await entretienService.updateEntretien(req.params.id, req.body, req.user);
  
  res.status(200).json({
    success: true,
    message: 'Entretien mis à jour avec succès',
    data: { entretien }
  });
});

/**
 * Confirmer un entretien
 * @route PUT /api/v1/interviews/:id/confirm
 * @group Entretiens - Opérations sur les entretiens
 * @param {string} req.params.id - ID de l'entretien
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Entretien confirmé
 */
exports.confirmEntretien = catchAsync(async (req, res) => {
  const entretien = await entretienService.confirmEntretien(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    message: 'Entretien confirmé avec succès',
    data: { entretien }
  });
});

/**
 * Annuler un entretien
 * @route PUT /api/v1/interviews/:id/cancel
 * @group Entretiens - Opérations sur les entretiens
 * @param {string} req.params.id - ID de l'entretien
 * @param {Object} req.body - Motif d'annulation
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Entretien annulé
 */
exports.cancelEntretien = catchAsync(async (req, res) => {
  const { motif } = req.body;
  const entretien = await entretienService.cancelEntretien(req.params.id, req.user._id, motif);
  
  res.status(200).json({
    success: true,
    message: 'Entretien annulé',
    data: { entretien }
  });
});

/**
 * Récupérer les entretiens de l'utilisateur
 * @route GET /api/v1/interviews/me
 * @group Entretiens - Opérations sur les entretiens
 * @param {Object} req.query - Filtres et pagination
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des entretiens
 */
exports.getMyEntretiens = catchAsync(async (req, res) => {
  const { page = 1, limit = 10, statut, date_debut, date_fin } = req.query;
  
  const filters = {};
  if (statut) filters.statut = statut;
  if (date_debut) filters.date_debut = date_debut;
  if (date_fin) filters.date_fin = date_fin;
  
  const result = await entretienService.getUserEntretiens(
    req.user._id,
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.entretiens,
    pagination: result.pagination
  });
});

/**
 * Générer un lien de visioconférence
 * @route POST /api/v1/interviews/:id/video-link
 * @group Entretiens - Opérations sur les entretiens
 * @param {string} req.params.id - ID de l'entretien
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Lien de visioconférence
 */
exports.generateVideoLink = catchAsync(async (req, res) => {
  const lien = await entretienService.generateVideoLink(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    message: 'Lien de visioconférence généré',
    data: { lien }
  });
});