/**
 * Service de gestion des entretiens
 * @module services/entretienService
 */

const Entretien = require('../models/Entretien');
const Candidature = require('../models/Candidature');
const User = require('../models/User');
const Offre = require('../models/Offre');
const emailService = require('./emailService');
const crypto = require('crypto');

/**
 * Crée un nouvel entretien
 * @param {Object} entretienData - Données de l'entretien
 * @param {Object} user - Utilisateur créateur
 * @returns {Promise<Object>} Entretien créé
 */
exports.createEntretien = async (entretienData, user) => {
  const { candidature_id, date_entretien, duree, mode, lieu, notes } = entretienData;
  
  // Vérifier que la candidature existe
  const candidature = await Candidature.findById(candidature_id)
    .populate('utilisateur_id')
    .populate('offre_id');
  
  if (!candidature) {
    throw new Error('Candidature non trouvée');
  }
  
  // Vérifier les droits (recruteur de l'offre ou admin)
  const offre = await Offre.findById(candidature.offre_id);
  if (offre.recruteur_id.toString() !== user._id.toString() && 
      user.role !== 'admin_plateforme') {
    throw new Error('Vous n\'avez pas les droits pour créer cet entretien');
  }
  
  // Créer l'entretien
  const entretien = new Entretien({
    candidature_id,
    date_entretien: new Date(date_entretien),
    duree: duree || 30,
    mode,
    lieu: mode === 'physique' ? lieu : null,
    notes
  });
  
  // Générer un lien de visio si nécessaire
  if (mode === 'visio') {
    entretien.lien_visio = await generateVideoMeetingLink();
  }
  
  await entretien.save();
  await entretien.populate('candidature_id');
  
  // Envoyer notification au candidat
  await emailService.sendInterviewInvitation(
    candidature.utilisateur_id.email,
    entretien,
    candidature,
    user
  );
  
  return entretien;
};

/**
 * Récupère un entretien par ID
 * @param {string} entretienId - ID de l'entretien
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Entretien trouvé
 */
exports.getEntretienById = async (entretienId, userId) => {
  const entretien = await Entretien.findById(entretienId)
    .populate({
      path: 'candidature_id',
      populate: {
        path: 'utilisateur_id offre_id'
      }
    });
  
  if (!entretien) {
    throw new Error('Entretien non trouvé');
  }
  
  // Vérifier les droits d'accès
  const candidature = entretien.candidature_id;
  const offre = candidature.offre_id;
  
  const hasAccess = 
    candidature.utilisateur_id._id.toString() === userId || // Candidat
    offre.recruteur_id.toString() === userId || // Recruteur
    offre.entreprise_id.toString() === userId; // Admin entreprise
  
  if (!hasAccess) {
    throw new Error('Accès refusé à cet entretien');
  }
  
  return entretien;
};

/**
 * Met à jour un entretien
 * @param {string} entretienId - ID de l'entretien
 * @param {Object} updateData - Données à mettre à jour
 * @param {Object} user - Utilisateur effectuant la mise à jour
 * @returns {Promise<Object>} Entretien mis à jour
 */
exports.updateEntretien = async (entretienId, updateData, user) => {
  const entretien = await Entretien.findById(entretienId)
    .populate('candidature_id');
  
  if (!entretien) {
    throw new Error('Entretien non trouvé');
  }
  
  // Seul le recruteur peut modifier l'entretien
  const candidature = await Candidature.findById(entretien.candidature_id)
    .populate('offre_id');
  const offre = candidature.offre_id;
  
  if (offre.recruteur_id.toString() !== user._id.toString() && 
      user.role !== 'admin_plateforme') {
    throw new Error('Vous n\'avez pas les droits pour modifier cet entretien');
  }
  
  // Champs autorisés à la mise à jour
  const allowedFields = ['date_entretien', 'duree', 'mode', 'lieu', 'notes'];
  const filteredData = {};
  
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });
  
  // Gérer le changement de mode
  if (filteredData.mode === 'visio' && !entretien.lien_visio) {
    filteredData.lien_visio = await generateVideoMeetingLink();
  } else if (filteredData.mode === 'physique') {
    filteredData.lien_visio = null;
  }
  
  Object.assign(entretien, filteredData);
  await entretien.save();
  
  // Notifier le candidat des changements
  const candidat = await User.findById(candidature.utilisateur_id);
  await emailService.sendInterviewUpdate(
    candidat.email,
    entretien,
    candidature,
    user
  );
  
  return entretien;
};

/**
 * Confirme un entretien
 * @param {string} entretienId - ID de l'entretien
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Entretien confirmé
 */
exports.confirmEntretien = async (entretienId, userId) => {
  const entretien = await Entretien.findById(entretienId)
    .populate('candidature_id');
  
  if (!entretien) {
    throw new Error('Entretien non trouvé');
  }
  
  // Vérifier que c'est le candidat qui confirme
  const candidature = await Candidature.findById(entretien.candidature_id)
    .populate('utilisateur_id');
  
  if (candidature.utilisateur_id._id.toString() !== userId) {
    throw new Error('Seul le candidat peut confirmer l\'entretien');
  }
  
  entretien.statut = 'confirme';
  await entretien.save();
  
  // Notifier le recruteur
  const offre = await Offre.findById(candidature.offre_id)
    .populate('recruteur_id');
  
  await emailService.sendInterviewConfirmation(
    offre.recruteur_id.email,
    entretien,
    candidature
  );
  
  return entretien;
};

/**
 * Annule un entretien
 * @param {string} entretienId - ID de l'entretien
 * @param {string} userId - ID de l'utilisateur
 * @param {string} motif - Motif d'annulation
 * @returns {Promise<Object>} Entretien annulé
 */
exports.cancelEntretien = async (entretienId, userId, motif) => {
  const entretien = await Entretien.findById(entretienId)
    .populate('candidature_id');
  
  if (!entretien) {
    throw new Error('Entretien non trouvé');
  }
  
  entretien.statut = 'annule';
  entretien.notes = motif ? `Annulé: ${motif}` : 'Entretien annulé';
  await entretien.save();
  
  // Notifier l'autre partie
  const candidature = await Candidature.findById(entretien.candidature_id)
    .populate('utilisateur_id offre_id');
  
  const offre = candidature.offre_id;
  const candidat = candidature.utilisateur_id;
  const recruteur = await User.findById(offre.recruteur_id);
  
  if (userId === candidat._id.toString()) {
    // Le candidat annule, notifier le recruteur
    await emailService.sendInterviewCancellation(
      recruteur.email,
      entretien,
      candidature,
      'candidat',
      motif
    );
  } else {
    // Le recruteur annule, notifier le candidat
    await emailService.sendInterviewCancellation(
      candidat.email,
      entretien,
      candidature,
      'recruteur',
      motif
    );
  }
  
  return entretien;
};

/**
 * Récupère les entretiens d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} filters - Filtres
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Entretiens paginés
 */
exports.getUserEntretiens = async (userId, filters = {}, page = 1, limit = 10) => {
  const user = await User.findById(userId);
  let query = {};
  
  if (user.role === 'candidat') {
    // Récupérer les candidatures du candidat
    const candidatures = await Candidature.find({ utilisateur_id: userId });
    const candidatureIds = candidatures.map(c => c._id);
    query.candidature_id = { $in: candidatureIds };
  } else {
    // Récupérer les offres du recruteur
    const offres = await Offre.find({ recruteur_id: userId });
    const candidatures = await Candidature.find({ 
      offre_id: { $in: offres.map(o => o._id) } 
    });
    const candidatureIds = candidatures.map(c => c._id);
    query.candidature_id = { $in: candidatureIds };
  }
  
  // Appliquer les filtres
  if (filters.statut) {
    query.statut = filters.statut;
  }
  
  if (filters.date_debut && filters.date_fin) {
    query.date_entretien = {
      $gte: new Date(filters.date_debut),
      $lte: new Date(filters.date_fin)
    };
  }
  
  const skip = (page - 1) * limit;
  
  const entretiens = await Entretien.find(query)
    .populate({
      path: 'candidature_id',
      populate: {
        path: 'utilisateur_id offre_id'
      }
    })
    .sort({ date_entretien: 1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Entretien.countDocuments(query);
  
  return {
    entretiens,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Génère un lien de visioconférence
 * @param {string} entretienId - ID de l'entretien
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<string>} Lien de visioconférence
 */
exports.generateVideoLink = async (entretienId, userId) => {
  const entretien = await Entretien.findById(entretienId);
  
  if (!entretien) {
    throw new Error('Entretien non trouvé');
  }
  
  if (entretien.mode !== 'visio') {
    throw new Error('Cet entretien n\'est pas en visioconférence');
  }
  
  if (!entretien.lien_visio) {
    entretien.lien_visio = await generateVideoMeetingLink();
    await entretien.save();
  }
  
  return entretien.lien_visio;
};

/**
 * Génère un lien de réunion vidéo
 * @returns {Promise<string>} Lien de réunion
 */
async function generateVideoMeetingLink() {
  // Ici on pourrait intégrer avec Zoom, Google Meet, Teams, etc.
  // Pour l'instant, on génère un lien simple
  const roomId = crypto.randomBytes(16).toString('hex');
  return `https://meet.hereoz.com/room/${roomId}`;
}