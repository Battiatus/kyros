/**
 * Service de gestion des profils
 * @module services/profileService
 */

const User = require('../models/User');
const Competence = require('../models/Competence');
const Experience = require('../models/Experience');
const Formation = require('../models/Formation');
const Langue = require('../models/Langue');
const Referent = require('../models/Referent');
const emailService = require('./emailService');
const crypto = require('crypto');

/**
 * Récupère le profil complet d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Profil complet
 */
exports.getFullProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  const [competences, experiences, formations, langues] = await Promise.all([
    Competence.find({ utilisateur_id: userId }),
    Experience.find({ utilisateur_id: userId }).populate({
      path: 'referents',
      model: 'Referent'
    }),
    Formation.find({ utilisateur_id: userId }),
    Langue.find({ utilisateur_id: userId })
  ]);
  
  return {
    user: user.toPublicJSON(),
    competences,
    experiences,
    formations,
    langues,
    completion: calculateCompletion(user, competences, experiences, formations, langues)
  };
};

/**
 * Met à jour le profil d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
exports.updateProfile = async (userId, updateData) => {
  // Champs autorisés à la mise à jour
  const allowedFields = [
    'nom', 'prenom', 'telephone', 'date_naissance', 'nationalite', 
    'adresse', 'resume_pro', 'disponibilites'
  ];
  
  const filteredData = {};
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredData[key] = updateData[key];
    }
  });
  
  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true
  });
  
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  return user.toPublicJSON();
};

/**
 * Ajoute une compétence à un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} competenceData - Données de la compétence
 * @returns {Promise<Object>} Compétence créée
 */
exports.addCompetence = async (userId, competenceData) => {
  const competence = new Competence({
    utilisateur_id: userId,
    ...competenceData
  });
  
  await competence.save();
  return competence;
};

/**
 * Supprime une compétence
 * @param {string} userId - ID de l'utilisateur
 * @param {string} competenceId - ID de la compétence
 * @returns {Promise<void>}
 */
exports.removeCompetence = async (userId, competenceId) => {
  const result = await Competence.findOneAndDelete({
    _id: competenceId,
    utilisateur_id: userId
  });
  
  if (!result) {
    throw new Error('Compétence non trouvée');
  }
};

/**
 * Ajoute une expérience à un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} experienceData - Données de l'expérience
 * @returns {Promise<Object>} Expérience créée
 */
exports.addExperience = async (userId, experienceData) => {
  const experience = new Experience({
    utilisateur_id: userId,
    ...experienceData
  });
  
  await experience.save();
  return experience;
};

/**
 * Met à jour une expérience
 * @param {string} userId - ID de l'utilisateur
 * @param {string} experienceId - ID de l'expérience
 * @param {Object} updateData - Données à mettre à jour
 * @returns {Promise<Object>} Expérience mise à jour
 */
exports.updateExperience = async (userId, experienceId, updateData) => {
  const experience = await Experience.findOneAndUpdate(
    { _id: experienceId, utilisateur_id: userId },
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!experience) {
    throw new Error('Expérience non trouvée');
  }
  
  return experience;
};

/**
 * Supprime une expérience
 * @param {string} userId - ID de l'utilisateur
 * @param {string} experienceId - ID de l'expérience
 * @returns {Promise<void>}
 */
exports.removeExperience = async (userId, experienceId) => {
  const result = await Experience.findOneAndDelete({
    _id: experienceId,
    utilisateur_id: userId
  });
  
  if (!result) {
    throw new Error('Expérience non trouvée');
  }
  
  // Supprimer aussi les référents associés
  await Referent.deleteMany({ experience_id: experienceId });
};

/**
 * Ajoute un référent à une expérience
 * @param {string} experienceId - ID de l'expérience
 * @param {Object} referentData - Données du référent
 * @returns {Promise<Object>} Référent créé
 */
exports.addReferent = async (experienceId, referentData) => {
  const experience = await Experience.findById(experienceId);
  if (!experience) {
    throw new Error('Expérience non trouvée');
  }
  
  // Générer un token de validation
  const token = crypto.randomBytes(32).toString('hex');
  
  const referent = new Referent({
    experience_id: experienceId,
    token_validation: token,
    ...referentData
  });
  
  await referent.save();
  
  // Récupérer les informations du candidat
  const candidat = await User.findById(experience.utilisateur_id);
  
  // Envoyer l'email de validation
  await emailService.sendReferenceValidation(
    referent.email,
    referent,
    experience,
    candidat,
    token
  );
  
  return referent;
};

/**
 * Ajoute une formation à un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} formationData - Données de la formation
 * @returns {Promise<Object>} Formation créée
 */
exports.addFormation = async (userId, formationData) => {
  const formation = new Formation({
    utilisateur_id: userId,
    ...formationData
  });
  
  await formation.save();
  return formation;
};

/**
 * Ajoute une langue à un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} langueData - Données de la langue
 * @returns {Promise<Object>} Langue créée
 */
exports.addLangue = async (userId, langueData) => {
  const langue = new Langue({
    utilisateur_id: userId,
    ...langueData
  });
  
  await langue.save();
  return langue;
};

/**
 * Récupère le profil public d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Profil public
 */
exports.getPublicProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  const [competences, experiences, formations, langues] = await Promise.all([
    Competence.find({ utilisateur_id: userId }),
    Experience.find({ utilisateur_id: userId, validated: true }),
    Formation.find({ utilisateur_id: userId, obtenu: true }),
    Langue.find({ utilisateur_id: userId })
  ]);
  
  // Retourner seulement les informations publiques
  return {
    user: {
      nom: user.nom,
      prenom: user.prenom,
      photo_profil: user.photo_profil,
      video_presentation: user.video_presentation,
      resume_pro: user.resume_pro,
      premium: user.premium
    },
    competences,
    experiences,
    formations,
    langues
  };
};

/**
 * Traite un CV uploadé
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} file - Fichier CV
 * @returns {Promise<Object>} Données extraites
 */
exports.processCV = async (userId, file) => {
  // Ici on pourrait intégrer un service d'IA pour analyser le CV
  // Pour l'instant, on simule l'extraction de données
  
  return {
    message: 'CV traité avec succès',
    suggestions: {
      competences: ['Service client', 'Gestion d\'équipe', 'Vente'],
      experiences: [
        {
          poste: 'Serveur',
          entreprise: 'Restaurant Le Gourmet',
          date_debut: '2020-01-01',
          date_fin: '2022-12-31'
        }
      ]
    }
  };
};

/**
 * Calcule le pourcentage de complétion du profil
 * @param {Object} user - Utilisateur
 * @param {Array} competences - Compétences
 * @param {Array} experiences - Expériences
 * @param {Array} formations - Formations
 * @param {Array} langues - Langues
 * @returns {Object} Informations de complétion
 */
function calculateCompletion(user, competences, experiences, formations, langues) {
  let score = 0;
  const criteria = {
    photo_profil: user.photo_profil ? 10 : 0,
    resume_pro: user.resume_pro ? 15 : 0,
    competences: competences.length >= 3 ? 20 : (competences.length * 6.67),
    experiences: experiences.length >= 2 ? 25 : (experiences.length * 12.5),
    formations: formations.length >= 1 ? 15 : 0,
    langues: langues.length >= 1 ? 10 : 0,
    adresse: user.adresse ? 5 : 0
  };
  
  score = Object.values(criteria).reduce((acc, val) => acc + val, 0);
  
  return {
    percentage: Math.round(score),
    criteria,
    missing: Object.keys(criteria).filter(key => criteria[key] === 0)
  };
}