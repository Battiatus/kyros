/**
 * Contrôleur de gestion des entreprises
 * @module controllers/entrepriseController
 */

const Entreprise = require('../models/Entreprise');
const ProfilEntreprise = require('../models/ProfilEntreprise');
const catchAsync = require('../utils/catchAsync');

/**
 * Créer un profil entreprise
 * @route POST /api/v1/companies
 * @group Entreprises - Opérations sur les entreprises
 * @param {Object} req.body - Données de l'entreprise
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Entreprise créée
 */
exports.createEntreprise = catchAsync(async (req, res) => {
  // Vérifier si l'utilisateur est administrateur ou recruteur
  if (!['admin_entreprise', 'recruteur'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Seuls les administrateurs et recruteurs peuvent créer des entreprises'
    });
  }
  
  // Créer l'entreprise
  const entreprise = new Entreprise({
    ...req.body,
    admin_id: req.user._id
  });
  
  await entreprise.save();
  
  // Initialiser le profil détaillé
  const profilEntreprise = new ProfilEntreprise({
    entreprise_id: entreprise._id,
    pourcentage_completion: 30 // Base avec les infos minimales
  });
  
  await profilEntreprise.save();
  
  // Mettre à jour l'utilisateur pour le rattacher à l'entreprise
  req.user.entreprise_id = entreprise._id;
  req.user.role = 'admin_entreprise'; // Premier créateur devient admin
  await req.user.save();
  
  res.status(201).json({
    success: true,
    message: 'Entreprise créée avec succès',
    data: { entreprise, profilEntreprise }
  });
});

/**
 * Récupérer une entreprise par ID
 * @route GET /api/v1/companies/:id
 * @group Entreprises - Opérations sur les entreprises
 * @param {string} req.params.id - ID de l'entreprise
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails de l'entreprise
 */
exports.getEntreprise = catchAsync(async (req, res) => {
  const entreprise = await Entreprise.findById(req.params.id);
  
  if (!entreprise) {
    return res.status(404).json({
      success: false,
      message: 'Entreprise non trouvée'
    });
  }
  
  const profilEntreprise = await ProfilEntreprise.findOne({ entreprise_id: entreprise._id });
  
  res.status(200).json({
    success: true,
    data: { entreprise, profilEntreprise }
  });
});

/**
 * Mettre à jour une entreprise
 * @route PUT /api/v1/companies/:id
 * @group Entreprises - Opérations sur les entreprises
 * @param {string} req.params.id - ID de l'entreprise
 * @param {Object} req.body - Données à mettre à jour
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Entreprise mise à jour
 */
exports.updateEntreprise = catchAsync(async (req, res) => {
  const entreprise = await Entreprise.findById(req.params.id);
  
  if (!entreprise) {
    return res.status(404).json({
      success: false,
      message: 'Entreprise non trouvée'
    });
  }
  
  // Vérifier les droits (admin entreprise ou admin plateforme)
  if (req.user.role !== 'admin_plateforme' && 
      (req.user.role !== 'admin_entreprise' || 
       entreprise._id.toString() !== req.user.entreprise_id.toString())) {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour modifier cette entreprise'
    });
  }
  
  // Mettre à jour
  Object.assign(entreprise, req.body);
  await entreprise.save();
  
  res.status(200).json({
    success: true,
    message: 'Entreprise mise à jour avec succès',
    data: { entreprise }
  });
});

/**
 * Mettre à jour le profil détaillé d'une entreprise
 * @route PUT /api/v1/companies/:id/profile
 * @group Entreprises - Opérations sur les entreprises
 * @param {string} req.params.id - ID de l'entreprise
 * @param {Object} req.body - Données du profil
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Profil mis à jour
 */
exports.updateProfilEntreprise = catchAsync(async (req, res) => {
  const entreprise = await Entreprise.findById(req.params.id);
  
  if (!entreprise) {
    return res.status(404).json({
      success: false,
      message: 'Entreprise non trouvée'
    });
  }
  
  // Vérifier les droits
  if (req.user.role !== 'admin_plateforme' && 
      (req.user.role !== 'admin_entreprise' || 
       entreprise._id.toString() !== req.user.entreprise_id.toString())) {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour modifier cette entreprise'
    });
  }
  
  let profilEntreprise = await ProfilEntreprise.findOne({ entreprise_id: entreprise._id });
  
  if (!profilEntreprise) {
    profilEntreprise = new ProfilEntreprise({
      entreprise_id: entreprise._id
    });
  }
  
  // Mettre à jour
  Object.assign(profilEntreprise, req.body);
  
  // Calculer le pourcentage de complétion
  const campsObligatoires = [
    'description_complete',
    'ambiance_travail',
    'avantages',
    'valeurs_entreprise'
  ];
  
  const champsRemplis = campsObligatoires.filter(champ => {
    const valeur = profilEntreprise[champ];
    return valeur && (
      typeof valeur === 'string' ? valeur.trim().length > 0 : 
      typeof valeur === 'object' ? Object.keys(valeur).length > 0 : 
      false
    );
  });
  
  profilEntreprise.pourcentage_completion = Math.floor((champsRemplis.length / campsObligatoires.length) * 100);
  profilEntreprise.badge_complete = profilEntreprise.pourcentage_completion === 100;
  
  await profilEntreprise.save();
  
  res.status(200).json({
    success: true,
    message: 'Profil entreprise mis à jour avec succès',
    data: { profilEntreprise }
  });
});

/**
 * Ajouter un membre à l'entreprise
 * @route POST /api/v1/companies/:id/members
 * @group Entreprises - Opérations sur les entreprises
 * @param {string} req.params.id - ID de l'entreprise
 * @param {Object} req.body - Données du membre
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat de l'opération
 */
exports.addMember = catchAsync(async (req, res) => {
  const { email, role = 'recruteur' } = req.body;
  
  const entreprise = await Entreprise.findById(req.params.id);
  
  if (!entreprise) {
    return res.status(404).json({
      success: false,
      message: 'Entreprise non trouvée'
    });
  }
  
  // Vérifier les droits (admin entreprise uniquement)
  if (req.user.role !== 'admin_entreprise' || 
      entreprise._id.toString() !== req.user.entreprise_id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour ajouter des membres'
    });
  }
  
  // Vérifier si le membre existe
  const User = require('../models/User');
  const membre = await User.findOne({ email });
  
  if (!membre) {
    return res.status(404).json({
      success: false,
      message: 'Utilisateur non trouvé'
    });
  }
  
  // Mettre à jour le membre
  membre.entreprise_id = entreprise._id;
  membre.role = role;
  await membre.save();
  
  res.status(200).json({
    success: true,
    message: 'Membre ajouté à l\'entreprise avec succès',
    data: { membre: membre.toPublicJSON() }
  });
});

/**
 * Récupérer les membres d'une entreprise
 * @route GET /api/v1/companies/:id/members
 * @group Entreprises - Opérations sur les entreprises
 * @param {string} req.params.id - ID de l'entreprise
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des membres
 */
exports.getMembers = catchAsync(async (req, res) => {
  const entreprise = await Entreprise.findById(req.params.id);
  
  if (!entreprise) {
    return res.status(404).json({
      success: false,
      message: 'Entreprise non trouvée'
    });
  }
  
  // Vérifier les droits (membre de l'entreprise ou admin plateforme)
  if (req.user.role !== 'admin_plateforme' && 
      req.user.entreprise_id.toString() !== entreprise._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour voir les membres'
    });
  }
  
  // Récupérer les membres
  const User = require('../models/User');
  const membres = await User.find({ entreprise_id: entreprise._id });
  
  res.status(200).json({
    success: true,
    data: { 
      membres: membres.map(membre => membre.toPublicJSON()) 
    }
  });
});