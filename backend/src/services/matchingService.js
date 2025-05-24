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
const SwipeHistorique = require('../models/SwipeHistorique');

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
    if (user.adresse.toLowerCase().includes(offre.localisation.toLowerCase())) {
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
  // Récupérer les offres déjà swipées pour les exclure
  const swipedOffres = await SwipeHistorique.find({ utilisateur_id: userId });
  const swipedOffreIds = swipedOffres.map(swipe => swipe.offre_id);
  
  // Récupérer les offres actives non encore swipées
  const query = { 
    statut: 'active',
    _id: { $nin: swipedOffreIds }
  };
  
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
  
  if (filters.salaire_min) {
    query.salaire_min = { $gte: filters.salaire_min };
  }
  
  // Récupérer toutes les offres qui correspondent aux filtres de base
  const offres = await Offre.find(query).populate('entreprise_id', 'nom logo');
  
  // Calculer le score de matching pour chaque offre
  const offresScores = await Promise.all(
    offres.map(async (offre) => {
      try {
        const score = await this.calculateMatchingScore(userId, offre._id);
        return {
          offre,
          score
        };
      } catch (error) {
        console.error(`Erreur calcul score pour offre ${offre._id}:`, error);
        return {
          offre,
          score: 0
        };
      }
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
 * Calcule le score de matching avec IA si disponible
 * @param {string} userId - ID du candidat
 * @param {string} offreId - ID de l'offre
 * @returns {Promise<Object>} Score et analyse détaillée
 */
exports.calculateMatchingScoreWithAI = async (userId, offreId) => {
  try {
    const aiService = require('./aiService');
    const profileService = require('./profileService');
    
    const [candidate, job] = await Promise.all([
      profileService.getFullProfile(userId),
      Offre.findById(offreId)
    ]);

    // Essayer d'abord avec l'IA
    const aiResult = await aiService.calculateAdvancedMatching(candidate, job);
    
    return {
      score: aiResult.overallScore,
      details: {
        skills: aiResult.skillsMatch,
        experience: aiResult.experienceMatch,
        cultural: aiResult.culturalFit,
        strengths: aiResult.strengths,
        concerns: aiResult.concerns,
        explanation: aiResult.explanation
      },
      aiPowered: true
    };
  } catch (error) {
    console.log('IA indisponible, utilisation de l\'algorithme classique:', error.message);
    
    // Fallback sur l'algorithme classique
    const classicScore = await this.calculateMatchingScore(userId, offreId);
    return {
      score: classicScore,
      details: {
        message: 'Score calculé avec l\'algorithme classique'
      },
      aiPowered: false
    };
  }
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
  const query = { role: 'candidat', validation_email: true };
  
  // Appliquer les filtres supplémentaires
  if (filters.localisation) {
    query.adresse = { $regex: filters.localisation, $options: 'i' };
  }
  
  if (filters.premium) {
    query.premium = filters.premium;
  }
  
  // Récupérer tous les candidats qui correspondent aux filtres de base
  const candidats = await User.find(query);
  
  // Calculer le score de matching pour chaque candidat
  const candidatsScores = await Promise.all(
    candidats.map(async (candidat) => {
      try {
        const score = await this.calculateMatchingScore(candidat._id, offreId);
        return {
          candidat: candidat.toPublicJSON(),
          score
        };
      } catch (error) {
        console.error(`Erreur calcul score pour candidat ${candidat._id}:`, error);
        return {
          candidat: candidat.toPublicJSON(),
          score: 0
        };
      }
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
  // Calculer le score de matching
  let scoreMatching = 0;
  try {
    scoreMatching = await this.calculateMatchingScore(userId, offreId);
  } catch (error) {
    console.error('Erreur calcul score matching:', error);
  }
  
  // Vérifier si un swipe existe déjà pour cette combinaison
  const existingSwipe = await SwipeHistorique.findOne({
    utilisateur_id: userId,
    offre_id: offreId
  });
  
  if (existingSwipe) {
    // Mettre à jour l'action existante
    existingSwipe.action = action;
    existingSwipe.motif_rejet = motifRejet;
    existingSwipe.score_matching = scoreMatching;
    await existingSwipe.save();
    
    return existingSwipe;
  } else {
    // Créer un nouvel historique
    const historique = new SwipeHistorique({
      utilisateur_id: userId,
      offre_id: offreId,
      action,
      motif_rejet: motifRejet,
      score_matching: scoreMatching
    });
    
    await historique.save();
    
    // Si c'est un swipe à droite, créer automatiquement une candidature
    if (action === 'droite') {
      const candidatureService = require('./candidatureService');
      const User = require('../models/User');
      
      try {
        const user = await User.findById(userId);
        await candidatureService.createCandidature(
          { offre_id: offreId },
          user
        );
      } catch (error) {
        // Ignorer les erreurs si la candidature existe déjà
        console.log(`Erreur lors de la création de candidature: ${error.message}`);
      }
    }
    
    return historique;
  }
};

/**
 * Récupère l'historique de swipe d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} filters - Filtres (action, date)
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Historique paginé
 */
exports.getSwipeHistory = async (userId, filters = {}, page = 1, limit = 10) => {
  const query = { utilisateur_id: userId };
  
  if (filters.action) {
    query.action = filters.action;
  }
  
  if (filters.dateDebut) {
    query.date = { $gte: new Date(filters.dateDebut) };
  }
  
  if (filters.dateFin) {
    query.date = { ...query.date, $lte: new Date(filters.dateFin) };
  }
  
  const skip = (page - 1) * limit;
  
  const historique = await SwipeHistorique.find(query)
    .populate('offre_id')
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await SwipeHistorique.countDocuments(query);
  
  return {
    historique,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};