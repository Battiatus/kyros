/**
 * Service de gestion des offres d'emploi
 * @module services/offreService
 */

const Offre = require('../models/Offre');
const User = require('../models/User');
const Entreprise = require('../models/Entreprise');

/**
 * Crée une nouvelle offre d'emploi
 * @param {Object} offreData - Données de l'offre
 * @param {Object} user - Utilisateur créateur (recruteur)
 * @returns {Promise<Object>} Offre créée
 */
exports.createOffre = async (offreData, user) => {
  if (!user.entreprise_id) {
    throw new Error('Vous devez être rattaché à une entreprise pour créer une offre');
  }
  
  const offre = new Offre({
    ...offreData,
    entreprise_id: user.entreprise_id,
    recruteur_id: user._id
  });
  
  await offre.save();
  
  return offre;
};

/**
 * Récupère une offre par son ID
 * @param {string} offreId - ID de l'offre
 * @returns {Promise<Object>} Offre trouvée
 */
exports.getOffreById = async (offreId) => {
  const offre = await Offre.findById(offreId);
  
  if (!offre) {
    throw new Error('Offre non trouvée');
  }
  
  return offre;
};

/**
 * Met à jour une offre existante
 * @param {string} offreId - ID de l'offre
 * @param {Object} updateData - Données à mettre à jour
 * @param {Object} user - Utilisateur effectuant la mise à jour
 * @returns {Promise<Object>} Offre mise à jour
 */
exports.updateOffre = async (offreId, updateData, user) => {
  const offre = await Offre.findById(offreId);
  
  if (!offre) {
    throw new Error('Offre non trouvée');
  }
  
  // Vérifier les droits
  if (offre.entreprise_id.toString() !== user.entreprise_id.toString()) {
    throw new Error('Vous n\'avez pas les droits pour modifier cette offre');
  }
  
  // Interdire la modification de certains champs
  delete updateData.entreprise_id;
  delete updateData.recruteur_id;
  delete updateData.nb_vues;
  delete updateData.nb_candidatures;
  
  Object.assign(offre, updateData);
  await offre.save();
  
  return offre;
};

/**
 * Change le statut d'une offre
 * @param {string} offreId - ID de l'offre
 * @param {string} statut - Nouveau statut
 * @param {Object} user - Utilisateur effectuant la mise à jour
 * @returns {Promise<Object>} Offre mise à jour
 */
exports.changeOffreStatus = async (offreId, statut, user) => {
  const offre = await Offre.findById(offreId);
  
  if (!offre) {
    throw new Error('Offre non trouvée');
  }
  
  // Vérifier les droits
  if (offre.entreprise_id.toString() !== user.entreprise_id.toString()) {
    throw new Error('Vous n\'avez pas les droits pour modifier cette offre');
  }
  
  offre.statut = statut;
  await offre.save();
  
  return offre;
};

/**
 * Recherche des offres selon critères
 * @param {Object} filters - Filtres de recherche
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'offres par page
 * @returns {Promise<Object>} Résultats paginés
 */
exports.searchOffres = async (filters = {}, page = 1, limit = 10) => {
  const query = { statut: 'active' };
  
  // Appliquer les filtres
  if (filters.localisation) {
    query.localisation = { $regex: filters.localisation, $options: 'i' };
  }
  
  if (filters.type_contrat) {
    query.type_contrat = filters.type_contrat;
  }
  
  if (filters.remote) {
    query.remote = filters.remote;
  }
  
  if (filters.competences && filters.competences.length > 0) {
    query.tags_competences = { $in: filters.competences };
  }
  
  if (filters.entreprise_id) {
    query.entreprise_id = filters.entreprise_id;
  }
  
  // Plage de salaire
  if (filters.salaire_min) {
    query.salaire_min = { $gte: filters.salaire_min };
  }
  
  if (filters.salaire_max) {
    query.salaire_max = { $lte: filters.salaire_max };
  }
  
  // Expérience requise
  if (filters.experience_max) {
    query.experience_requise = { $lte: filters.experience_max };
  }
  
  // Pagination
  const skip = (page - 1) * limit;
  
  // Exécuter la requête
  const offres = await Offre.find(query)
    .sort({ date_creation: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Offre.countDocuments(query);
  
  return {
    offres,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Récupère les offres d'une entreprise
 * @param {string} entrepriseId - ID de l'entreprise
 * @param {string} statut - Filtre par statut
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'offres par page
 * @returns {Promise<Object>} Résultats paginés
 */
exports.getOffresEntreprise = async (entrepriseId, statut, page = 1, limit = 10) => {
  const query = { entreprise_id: entrepriseId };
  
  if (statut) {
    query.statut = statut;
  }
  
  const skip = (page - 1) * limit;
  
  const offres = await Offre.find(query)
    .sort({ date_creation: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Offre.countDocuments(query);
  
  return {
    offres,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Incrémente le compteur de vues d'une offre
 * @param {string} offreId - ID de l'offre
 * @returns {Promise<void>}
 */
exports.incrementViews = async (offreId) => {
  await Offre.findByIdAndUpdate(offreId, {
    $inc: { nb_vues: 1 }
  });
};

/**
 * Récupère les statistiques d'une offre
 * @param {string} offreId - ID de l'offre
 * @returns {Promise<Object>} Statistiques
 */
exports.getOffreStats = async (offreId) => {
  const offre = await Offre.findById(offreId);
  
  if (!offre) {
    throw new Error('Offre non trouvée');
  }
  
  // Récupérer les statistiques complètes (à implémenter selon besoins)
  
  return {
    vues: offre.nb_vues,
    candidatures: offre.nb_candidatures,
    // Autres statistiques à ajouter
  };
};

/**
 * Optimise une offre avec l'IA (simulation)
 * @param {string} offreId - ID de l'offre
 * @returns {Promise<Object>} Offre optimisée
 */
exports.optimizeOffre = async (offreId) => {
  const offre = await Offre.findById(offreId);
  
  if (!offre) {
    throw new Error('Offre non trouvée');
  }
  
  // Ici, il faudrait appeler un service IA pour optimiser l'offre
  // Pour la démonstration, on simule une optimisation
  const optimizedDescription = `${offre.description}\n\n[Ce texte a été optimisé pour augmenter l'attractivité de l'offre]`;
  
  offre.description = optimizedDescription;
  await offre.save();
  
  return offre;
};