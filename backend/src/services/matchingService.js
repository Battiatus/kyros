/**
 * Service de matching entre candidats et offres
 * @module services/matchingService
 */

const User = require('../models/User');
const Offre = require('../models/Offre');
const Competence = require('../models/Competence');
const Experience = require('../models/Experience');
const Disponibilite = require('../models/Disponibilite');
const Langue = require('../models/Langue');

/**
 * Calcule le score de matching entre un candidat et une offre
 * @param {string} userId - ID du candidat
 * @param {string} offreId - ID de l'offre
 * @returns {Promise<number>} Score de matching (0-100)
 */
exports.calculateMatchingScore = async (userId, offreId) => {
  const user = await User.findById(userId);
  const offre = await Offre.findById(offreId);
  
  if (!user || !offre) {
    throw new Error('Utilisateur ou offre non trouvé');
  }
  
  // Récupérer les compétences du candidat
  const competencesUser = await Competence.find({ utilisateur_id: userId });
  const competencesNames = competencesUser.map(c => c.competence.toLowerCase());
  
  // Compétences requises par l'offre
  const competencesRequises = offre.tags_competences.map(c => c.toLowerCase());
  
  // Calcul du score de compétences (40% du score total)
  let matchCompetences = 0;
  if (competencesRequises.length > 0) {
    const matchingCompetences = competencesRequises.filter(c => competencesNames.includes(c));
    matchCompetences = (matchingCompetences.length / competencesRequises.length) * 40;
  } else {
    matchCompetences = 40; // Pas de compétences requises = score max
  }
  
  // Récupérer les expériences du candidat
  const experiences = await Experience.find({ utilisateur_id: userId });
  
  // Calculer l'expérience totale en années
  let totalExperience = 0;
  experiences.forEach(exp => {
    const debut = new Date(exp.date_debut);
    const fin = exp.date_fin ? new Date(exp.date_fin) : new Date();
    const dureeAnnees = (fin - debut) / (1000 * 60 * 60 * 24 * 365);
    totalExperience += dureeAnnees;
  });
  
  // Expérience requise par l'offre (20% du score total)
  let matchExperience = 0;
  if (offre.experience_requise > 0) {
    matchExperience = Math.min(totalExperience / offre.experience_requise, 1) * 20;
  } else {
    matchExperience = 20; // Pas d'expérience requise = score max
  }
  
  // Langues requises par l'offre (20% du score total)
  let matchLangues = 0;
  if (offre.langues_requises && offre.langues_requises.length > 0) {
    const languesUser = await Langue.find({ utilisateur_id: userId });
    const languesNames = languesUser.map(l => l.langue.toLowerCase());
    
    const languesRequises = offre.langues_requises.map(l => l.toLowerCase());
    const matchingLangues = languesRequises.filter(l => languesNames.includes(l));
    
    matchLangues = (matchingLangues.length / languesRequises.length) * 20;
  } else {
    matchLangues = 20; // Pas de langues requises = score max
  }
  
  // Localisation et disponibilité (20% du score total)
  let matchLocalisation = 10; // Par défaut 10%
  
  // Si l'offre a une localisation spécifique et que l'utilisateur a indiqué sa position
  if (offre.localisation && user.adresse) {
    // Dans un vrai cas, on utiliserait un service de géolocalisation
    // Pour simplifier, on simule une correspondance parfaite
    if (user.adresse.includes(offre.localisation)) {
      matchLocalisation = 20;
    } else {
      matchLocalisation = 10;
    }
  }
  
  // Si l'offre est en remote
  if (offre.remote === 'full_remote') {
    matchLocalisation = 20; // Score max pour remote
  }
  
  // Calcul du score total
  const totalScore = matchCompetences + matchExperience + matchLangues + matchLocalisation;
  
  // Arrondir à l'entier le plus proche
  return Math.round(totalScore);
};

/**
 * Trouve les meilleures offres pour un candidat
 * @param {string} userId - ID du candidat
 * @param {Object} filters - Filtres supplémentaires
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'offres par page
 * @returns {Promise<Object>} Offres suggérées avec scores
 */
exports.getSuggestedOffres = async (userId, filters = {}, page = 1, limit = 10) => {
  // Récupérer les offres actives
  const query = { statut: 'active' };
  
  // Appliquer les filtres supplémentaires
  if (filters.localisation) {
    query.localisation = { $regex: filters.localisation, $options: 'i' };
  }
  
  if (filters.type_contrat) {
    query.type_contrat = filters.type_contrat;
  }
  
  if (filters.remote) {
    query.remote = filters.remote;
  }
  
  // Récupérer toutes les offres qui correspondent aux filtres de base
  const offres = await Offre.find(query);
  
  // Calculer le score de matching pour chaque offre
  const offresScores = await Promise.all(
    offres.map(async (offre) => {
      const score = await this.calculateMatchingScore(userId, offre._id);
      return {
        offre,
        score
      };
    })
  );
  
  // Trier par score de matching décroissant
  offresScores.sort((a, b) => b.score - a.score);
  
  // Appliquer la pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResults = offresScores.slice(startIndex, endIndex);
  
  return {
    suggestions: paginatedResults,
    pagination: {
      total: offresScores.length,
      page,
      limit,
      pages: Math.ceil(offresScores.length / limit)
    }
  };
};

/**
 * Trouve les meilleurs candidats pour une offre
 * @param {string} offreId - ID de l'offre
 * @param {Object} filters - Filtres supplémentaires
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre de candidats par page
 * @returns {Promise<Object>} Candidats suggérés avec scores
 */
exports.getSuggestedCandidats = async (offreId, filters = {}, page = 1, limit = 10) => {
  // Récupérer les candidats actifs
  const query = { role: 'candidat' };
  
  // Récupérer tous les candidats qui correspondent aux filtres de base
  const candidats = await User.find(query);
  
  // Calculer le score de matching pour chaque candidat
  const candidatsScores = await Promise.all(
    candidats.map(async (candidat) => {
      const score = await this.calculateMatchingScore(candidat._id, offreId);
      return {
        candidat,
        score
      };
    })
  );
  
  // Trier par score de matching décroissant
  candidatsScores.sort((a, b) => b.score - a.score);
  
  // Appliquer la pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResults = candidatsScores.slice(startIndex, endIndex);
  
  return {
    suggestions: paginatedResults,
    pagination: {
      total: candidatsScores.length,
      page,
      limit,
      pages: Math.ceil(candidatsScores.length / limit)
    }
  };
};

/**
 * Enregistre l'action de swipe d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} offreId - ID de l'offre
 * @param {string} action - Type d'action (droite, gauche, favori)
 * @param {string} motifRejet - Motif de rejet optionnel
 * @returns {Promise<Object>} Historique créé
 */
exports.recordSwipeAction = async (userId, offreId, action, motifRejet = null) => {
  const SwipeHistorique = require('../models/SwipeHistorique');
  
  const historique = new SwipeHistorique({
    utilisateur_id: userId,
    offre_id: offreId,
    action,
    motif_rejet: motifRejet
  });
  
  await historique.save();
  
  // Si c'est un swipe à droite, créer automatiquement une candidature
  if (action === 'droite') {
    const candidatureService = require('./candidatureService');
    try {
      await candidatureService.createCandidature(
        { offre_id: offreId },
        { _id: userId }
      );
    } catch (error) {
      // Ignorer les erreurs si la candidature existe déjà
      console.log(`Erreur lors de la création de candidature: ${error.message}`);
    }
  }
  
  return historique;
};