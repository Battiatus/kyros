/**
 * Contrôleur de gestion des profils utilisateurs
 * @module controllers/profileController
 */

const profileService = require('../services/profileService');
const uploadService = require('../services/uploadService');
const catchAsync = require('../utils/catchAsync');

/**
 * Récupérer le profil de l'utilisateur connecté
 * @route GET /api/v1/profiles/me
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Profil complet de l'utilisateur
 */
exports.getMyProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getFullProfile(req.user._id);
  
  res.status(200).json({
    success: true,
    data: { profile }
  });
});

/**
 * Mettre à jour le profil de l'utilisateur
 * @route PUT /api/v1/profiles/me
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {Object} req.body - Données du profil
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Profil mis à jour
 */
exports.updateMyProfile = catchAsync(async (req, res) => {
  const profile = await profileService.updateProfile(req.user._id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Profil mis à jour avec succès',
    data: { profile }
  });
});

/**
 * Ajouter une compétence
 * @route POST /api/v1/profiles/me/competences
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {Object} req.body - Données de la compétence
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Compétence ajoutée
 */
exports.addCompetence = catchAsync(async (req, res) => {
  const competence = await profileService.addCompetence(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Compétence ajoutée avec succès',
    data: { competence }
  });
});

/**
 * Supprimer une compétence
 * @route DELETE /api/v1/profiles/me/competences/:id
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {string} req.params.id - ID de la compétence
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Confirmation de suppression
 */
exports.removeCompetence = catchAsync(async (req, res) => {
  await profileService.removeCompetence(req.user._id, req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Compétence supprimée avec succès'
  });
});

/**
 * Ajouter une expérience
 * @route POST /api/v1/profiles/me/experiences
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {Object} req.body - Données de l'expérience
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Expérience ajoutée
 */
exports.addExperience = catchAsync(async (req, res) => {
  const experience = await profileService.addExperience(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Expérience ajoutée avec succès',
    data: { experience }
  });
});

/**
 * Mettre à jour une expérience
 * @route PUT /api/v1/profiles/me/experiences/:id
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {string} req.params.id - ID de l'expérience
 * @param {Object} req.body - Données à mettre à jour
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Expérience mise à jour
 */
exports.updateExperience = catchAsync(async (req, res) => {
  const experience = await profileService.updateExperience(req.user._id, req.params.id, req.body);
  
  res.status(200).json({
    success: true,
    message: 'Expérience mise à jour avec succès',
    data: { experience }
  });
});

/**
 * Supprimer une expérience
 * @route DELETE /api/v1/profiles/me/experiences/:id
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {string} req.params.id - ID de l'expérience
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Confirmation de suppression
 */
exports.removeExperience = catchAsync(async (req, res) => {
  await profileService.removeExperience(req.user._id, req.params.id);
  
  res.status(200).json({
    success: true,
    message: 'Expérience supprimée avec succès'
  });
});

/**
 * Ajouter un référent à une expérience
 * @route POST /api/v1/profiles/me/experiences/:id/referents
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {string} req.params.id - ID de l'expérience
 * @param {Object} req.body - Données du référent
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Référent ajouté
 */
exports.addReferent = catchAsync(async (req, res) => {
  const referent = await profileService.addReferent(req.params.id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Référent ajouté avec succès. Un email de validation lui a été envoyé.',
    data: { referent }
  });
});

/**
 * Upload de photo de profil
 * @route POST /api/v1/profiles/me/photo
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {Object} req.file - Fichier uploadé
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} URL de la photo
 */
exports.uploadProfilePhoto = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier fourni'
    });
  }
  
  const photoUrl = await uploadService.uploadProfilePhoto(req.user._id, req.file);
  
  res.status(200).json({
    success: true,
    message: 'Photo de profil mise à jour avec succès',
    data: { photoUrl }
  });
});

/**
 * Upload de CV
 * @route POST /api/v1/profiles/me/cv
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {Object} req.file - Fichier CV
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Données extraites du CV
 */
exports.uploadCV = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Aucun fichier CV fourni'
    });
  }
  
  const extractedData = await profileService.processCV(req.user._id, req.file);
  
  res.status(200).json({
    success: true,
    message: 'CV traité avec succès',
    data: extractedData
  });
});

/**
 * Ajouter une formation
 * @route POST /api/v1/profiles/me/formations
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {Object} req.body - Données de la formation
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Formation ajoutée
 */
exports.addFormation = catchAsync(async (req, res) => {
  const formation = await profileService.addFormation(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Formation ajoutée avec succès',
    data: { formation }
  });
});

/**
 * Ajouter une langue
 * @route POST /api/v1/profiles/me/langues
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {Object} req.body - Données de la langue
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Langue ajoutée
 */
exports.addLangue = catchAsync(async (req, res) => {
  const langue = await profileService.addLangue(req.user._id, req.body);
  
  res.status(201).json({
    success: true,
    message: 'Langue ajoutée avec succès',
    data: { langue }
  });
});

/**
 * Récupérer un profil public par ID
 * @route GET /api/v1/profiles/:id
 * @group Profils - Opérations sur les profils utilisateurs
 * @param {string} req.params.id - ID de l'utilisateur
 * @param {Object} res - Réponse Express
 * @returns {Object} Profil public
 */
exports.getPublicProfile = catchAsync(async (req, res) => {
  const profile = await profileService.getPublicProfile(req.params.id);
  
  res.status(200).json({
    success: true,
    data: { profile }
  });
});