/**
 * Service de gestion des uploads
 * @module services/uploadService
 */

const path = require('path');
const fs = require('fs').promises;
const User = require('../models/User');
const Entreprise = require('../models/Entreprise');

/**
 * Upload une photo de profil
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} file - Fichier uploadé
 * @returns {Promise<string>} URL de la photo
 */
exports.uploadProfilePhoto = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  // Supprimer l'ancienne photo si elle existe
  if (user.photo_profil) {
    const oldPhotoPath = path.join(process.cwd(), 'public', user.photo_profil.replace('/uploads/', 'uploads/'));
    try {
      await fs.unlink(oldPhotoPath);
    } catch (error) {
      console.log('Ancienne photo non trouvée:', error.message);
    }
  }
  
  // Construire l'URL publique
  const photoUrl = `/uploads/profiles/${file.filename}`;
  
  // Mettre à jour l'utilisateur
  user.photo_profil = photoUrl;
  await user.save();
  
  return photoUrl;
};

/**
 * Upload un logo d'entreprise
 * @param {string} entrepriseId - ID de l'entreprise
 * @param {Object} file - Fichier uploadé
 * @returns {Promise<string>} URL du logo
 */
exports.uploadCompanyLogo = async (entrepriseId, file) => {
  const entreprise = await Entreprise.findById(entrepriseId);
  if (!entreprise) {
    throw new Error('Entreprise non trouvée');
  }
  
  // Supprimer l'ancien logo si il existe
  if (entreprise.logo) {
    const oldLogoPath = path.join(process.cwd(), 'public', entreprise.logo.replace('/uploads/', 'uploads/'));
    try {
      await fs.unlink(oldLogoPath);
    } catch (error) {
      console.log('Ancien logo non trouvé:', error.message);
    }
  }
  
  // Construire l'URL publique
  const logoUrl = `/uploads/companies/${file.filename}`;
  
  // Mettre à jour l'entreprise
  entreprise.logo = logoUrl;
  await entreprise.save();
  
  return logoUrl;
};

/**
 * Traite un CV uploadé (simulation)
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} file - Fichier CV
 * @returns {Promise<Object>} Données extraites
 */
exports.processCV = async (userId, file) => {
  // Ici on pourrait intégrer un service d'IA pour analyser le CV
  // Pour l'instant, on simule l'extraction de données
  
  const cvUrl = `/uploads/cv/${file.filename}`;
  
  // Analyser le nom du fichier pour simuler une extraction
  const suggestions = {
    competences: [],
    experiences: [],
    formations: []
  };
  
  // Simulation basique basée sur le nom du fichier
  if (file.originalname.toLowerCase().includes('chef')) {
    suggestions.competences.push('Cuisine', 'Gestion d\'équipe', 'Créativité culinaire');
    suggestions.experiences.push({
      poste: 'Chef de partie',
      entreprise: 'Restaurant gastronomique',
      description: 'Gestion d\'une section cuisine'
    });
  } else if (file.originalname.toLowerCase().includes('serveur')) {
    suggestions.competences.push('Service client', 'Vente', 'Communication');
    suggestions.experiences.push({
      poste: 'Serveur',
      entreprise: 'Restaurant',
      description: 'Service en salle'
    });
  } else {
    suggestions.competences.push('Hôtellerie', 'Restauration', 'Service client');
  }
  
  return {
    cvUrl,
    extractedData: suggestions,
    message: 'CV analysé avec succès. Voici les suggestions basées sur votre document.'
  };
};

/**
 * Supprime un fichier
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<void>}
 */
exports.deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath.replace('/uploads/', 'uploads/'));
    await fs.unlink(fullPath);
  } catch (error) {
    console.log('Erreur lors de la suppression du fichier:', error.message);
  }
};

/**
 * Vérifie si un fichier existe
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<boolean>} Existe ou non
 */
exports.fileExists = async (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath.replace('/uploads/', 'uploads/'));
    await fs.access(fullPath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Obtient les informations d'un fichier
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<Object>} Informations du fichier
 */
exports.getFileInfo = async (filePath) => {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath.replace('/uploads/', 'uploads/'));
    const stats = await fs.stat(fullPath);
    
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      exists: true
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
};