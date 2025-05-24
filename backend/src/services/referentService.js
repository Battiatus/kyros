/**
 * Service de gestion des référents
 * @module services/referentService
 */

const Referent = require('../models/Referent');
const Experience = require('../models/Experience');
const User = require('../models/User');
const emailService = require('./emailService');

/**
 * Récupère un référent par son token
 * @param {string} token - Token de validation
 * @returns {Promise<Object>} Données du référent et de l'expérience
 */
exports.getReferentByToken = async (token) => {
  const referent = await Referent.findOne({ token_validation: token })
    .populate({
      path: 'experience_id',
      populate: {
        path: 'utilisateur_id',
        select: 'nom prenom'
      }
    });
  
  if (!referent) {
    throw new Error('Token de validation invalide ou expiré');
  }
  
  if (referent.statut !== 'en_attente') {
    throw new Error('Cette référence a déjà été traitée');
  }
  
  return {
    referent: {
      nom: referent.nom,
      prenom: referent.prenom,
      poste: referent.poste,
      entreprise: referent.entreprise
    },
    experience: referent.experience_id,
    candidat: referent.experience_id.utilisateur_id
  };
};

/**
 * Soumet la validation d'une référence
 * @param {string} token - Token de validation
 * @param {string} validation - 'valide' ou 'refuse'
 * @param {string} commentaire - Commentaire optionnel
 * @returns {Promise<Object>} Résultat de la validation
 */
exports.submitValidation = async (token, validation, commentaire) => {
  const referent = await Referent.findOne({ token_validation: token })
    .populate({
      path: 'experience_id',
      populate: {
        path: 'utilisateur_id'
      }
    });
  
  if (!referent) {
    throw new Error('Token de validation invalide');
  }
  
  if (referent.statut !== 'en_attente') {
    throw new Error('Cette référence a déjà été traitée');
  }
  
  // Mettre à jour le référent
  referent.statut = validation;
  referent.commentaire = commentaire;
  referent.date_reponse = new Date();
  await referent.save();
  
  // Mettre à jour l'expérience si validée
  if (validation === 'valide') {
    const experience = await Experience.findById(referent.experience_id);
    experience.validated = true;
    await experience.save();
  }
  
  // Notifier le candidat
  const candidat = referent.experience_id.utilisateur_id;
  await emailService.sendReferenceValidationResult(
    candidat.email,
    referent,
    validation,
    commentaire
  );
  
  return {
    validation,
    experience: referent.experience_id,
    commentaire
  };
};

/**
 * Récupère les références en attente pour un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Références en attente
 */
exports.getPendingReferences = async (userId) => {
  const experiences = await Experience.find({ utilisateur_id: userId });
  const experienceIds = experiences.map(exp => exp._id);
  
  const references = await Referent.find({
    experience_id: { $in: experienceIds },
    statut: 'en_attente'
  }).populate('experience_id');
  
  return references;
};

/**
 * Envoie un rappel à un référent
 * @param {string} referentId - ID du référent
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<void>}
 */
exports.remindReferent = async (referentId, userId) => {
  const referent = await Referent.findById(referentId)
    .populate({
      path: 'experience_id',
      populate: {
        path: 'utilisateur_id'
      }
    });
  
  if (!referent) {
    throw new Error('Référent non trouvé');
  }
  
  // Vérifier que c'est bien l'utilisateur propriétaire de l'expérience
  if (referent.experience_id.utilisateur_id._id.toString() !== userId) {
    throw new Error('Vous n\'avez pas les droits pour cette action');
  }
  
  if (referent.statut !== 'en_attente') {
    throw new Error('Cette référence a déjà été traitée');
  }
  
  // Vérifier qu'on n'a pas envoyé de rappel récemment (moins de 48h)
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  if (referent.date_demande > twoDaysAgo) {
    throw new Error('Vous ne pouvez envoyer un rappel que 48h après la dernière demande');
  }
  
  // Envoyer le rappel
  await emailService.sendReferenceReminder(
    referent.email,
    referent,
    referent.experience_id,
    referent.experience_id.utilisateur_id,
    referent.token_validation
  );
  
  // Mettre à jour la date de demande
  referent.date_demande = new Date();
  await referent.save();
};