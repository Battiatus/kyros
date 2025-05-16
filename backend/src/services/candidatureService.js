/**
 * Service de gestion des candidatures
 * @module services/candidatureService
 */

const Candidature = require('../models/Candidature');
const Offre = require('../models/Offre');
const User = require('../models/User');
const emailService = require('./emailService');
const matchingService = require('./matchingService');

/**
 * Crée une nouvelle candidature
 * @param {Object} candidatureData - Données de la candidature
 * @param {Object} user - Utilisateur candidat
 * @returns {Promise<Object>} Candidature créée
 */
exports.createCandidature = async (candidatureData, user) => {
  // Vérifier si l'offre existe
  const offre = await Offre.findById(candidatureData.offre_id);
  if (!offre) {
    throw new Error('Offre non trouvée');
  }
  
  // Vérifier si l'offre est toujours active
  if (offre.statut !== 'active') {
    throw new Error('Cette offre n\'est plus disponible');
  }
  
  // Vérifier si une candidature existe déjà
  const existingCandidature = await Candidature.findOne({
    utilisateur_id: user._id,
    offre_id: candidatureData.offre_id
  });
  
  if (existingCandidature) {
    throw new Error('Vous avez déjà postulé à cette offre');
  }
  
  // Calculer le score de matching
  const matchingScore = await matchingService.calculateMatchingScore(user._id, offre._id);
  
  // Créer la candidature
  const candidature = new Candidature({
    utilisateur_id: user._id,
    offre_id: candidatureData.offre_id,
    message_personnalise: candidatureData.message_personnalise,
    score_matching: matchingScore
  });
  
  await candidature.save();
  
  // Incrémenter le compteur de candidatures de l'offre
  await Offre.findByIdAndUpdate(offre._id, {
    $inc: { nb_candidatures: 1 }
  });
  
  // Récupérer le recruteur pour notification
  const recruteur = await User.findById(offre.recruteur_id);
  
  // Envoyer notification au recruteur
  if (recruteur) {
    await emailService.sendNewApplicationNotification(
      recruteur.email,
      candidature,
      user,
      offre
    );
  }
  
  return candidature;
};

/**
 * Récupère une candidature par son ID
 * @param {string} candidatureId - ID de la candidature
 * @returns {Promise<Object>} Candidature avec données relationnelles
 */
exports.getCandidatureById = async (candidatureId) => {
  const candidature = await Candidature.findById(candidatureId)
    .populate('utilisateur_id', 'nom prenom email photo_profil video_presentation')
    .populate('offre_id');
  
  if (!candidature) {
    throw new Error('Candidature non trouvée');
  }
  
  return candidature;
};

/**
 * Met à jour le statut d'une candidature
 * @param {string} candidatureId - ID de la candidature
 * @param {string} statut - Nouveau statut
 * @param {Object} updateData - Données supplémentaires (notes, motif refus)
 * @param {Object} user - Utilisateur effectuant la mise à jour
 * @returns {Promise<Object>} Candidature mise à jour
 */
exports.updateCandidatureStatus = async (candidatureId, statut, updateData, user) => {
  const candidature = await Candidature.findById(candidatureId)
    .populate('offre_id');
  
  if (!candidature) {
    throw new Error('Candidature non trouvée');
  }
  
  // Vérifier les droits (recruteur lié à l'offre ou admin)
  const offre = await Offre.findById(candidature.offre_id);
  
  if (!offre || (offre.recruteur_id.toString() !== user._id.toString() && 
      offre.entreprise_id.toString() !== user.entreprise_id.toString() && 
      user.role !== 'admin_plateforme')) {
    throw new Error('Vous n\'avez pas les droits pour modifier cette candidature');
  }
  
  // Mettre à jour le statut
  candidature.statut = statut;
  
  // Ajouter les notes du recruteur si fournies
  if (updateData.notes_recruteur) {
    candidature.notes_recruteur = updateData.notes_recruteur;
  }
  
  // Ajouter le motif de refus si fourni
  if (updateData.motif_refus) {
    candidature.motif_refus = updateData.motif_refus;
  }
  
  await candidature.save();
  
  // Récupérer le candidat pour notification
  const candidat = await User.findById(candidature.utilisateur_id);
  
  // Envoyer notification au candidat
  if (candidat) {
    await emailService.sendApplicationStatusUpdate(
      candidat.email,
      candidature,
      offre,
      statut
    );
  }
  
  return candidature;
};

/**
 * Récupère les candidatures d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} filters - Filtres (statut, etc.)
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Candidatures paginées
 */
exports.getUserCandidatures = async (userId, filters = {}, page = 1, limit = 10) => {
  const query = { utilisateur_id: userId };
  
  if (filters.statut) {
    query.statut = filters.statut;
  }
  
  const skip = (page - 1) * limit;
  
  const candidatures = await Candidature.find(query)
    .populate('offre_id')
    .sort({ date_candidature: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Candidature.countDocuments(query);
  
  return {
    candidatures,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Récupère les candidatures pour une offre
 * @param {string} offreId - ID de l'offre
 * @param {Object} filters - Filtres (statut, etc.)
 * @param {Object} sort - Tri (score, date, etc.)
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Candidatures paginées
 */
exports.getOffreCandidatures = async (offreId, filters = {}, sort = {}, page = 1, limit = 10) => {
  const query = { offre_id: offreId };
  
  if (filters.statut) {
    query.statut = filters.statut;
  }
  
  // Déterminer le tri
  let sortOption = { date_candidature: -1 }; // Par défaut, plus récentes d'abord
  
  if (sort.field === 'score') {
    sortOption = { score_matching: sort.order === 'asc' ? 1 : -1 };
  } else if (sort.field === 'date') {
    sortOption = { date_candidature: sort.order === 'asc' ? 1 : -1 };
  }
  
  const skip = (page - 1) * limit;
  
  const candidatures = await Candidature.find(query)
    .populate({
      path: 'utilisateur_id',
      select: 'nom prenom email photo_profil video_presentation'
    })
    .sort(sortOption)
    .skip(skip)
    .limit(limit);
  
  const total = await Candidature.countDocuments(query);
  
  return {
    candidatures,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};