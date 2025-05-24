/**
 * Service d'administration
 * @module services/adminService
 */

const User = require('../models/User');
const Entreprise = require('../models/Entreprise');
const Offre = require('../models/Offre');
const Candidature = require('../models/Candidature');
const Paiement = require('../models/Paiement');
const Message = require('../models/Message');

/**
 * Récupère les statistiques globales
 * @param {string} dateDebut - Date de début
 * @param {string} dateFin - Date de fin
 * @returns {Promise<Object>} Statistiques globales
 */
exports.getGlobalStats = async (dateDebut, dateFin) => {
  const dateFilter = {};
  if (dateDebut) dateFilter.$gte = new Date(dateDebut);
  if (dateFin) dateFilter.$lte = new Date(dateFin);
  
  const query = dateFilter.length ? { date_creation: dateFilter } : {};
  
  const [
    totalUsers,
    totalCandidates,
    totalRecruiters,
    totalCompanies,
    totalJobs,
    activeJobs,
    totalApplications,
    totalPayments,
    revenueTotal
  ] = await Promise.all([
    User.countDocuments(query),
    User.countDocuments({ ...query, role: 'candidat' }),
    User.countDocuments({ ...query, role: { $in: ['recruteur', 'admin_entreprise'] } }),
    Entreprise.countDocuments(query),
    Offre.countDocuments(query),
    Offre.countDocuments({ statut: 'active' }),
    Candidature.countDocuments(query),
    Paiement.countDocuments({ ...query, statut: 'success' }),
    Paiement.aggregate([
      { $match: { ...query, statut: 'success' } },
      { $group: { _id: null, total: { $sum: '$montant' } } }
    ])
  ]);
  
  // Calculer les taux de conversion
  const conversionRate = totalJobs > 0 ? (totalApplications / totalJobs * 100).toFixed(2) : 0;
  const avgRevenuePerUser = totalUsers > 0 ? (revenueTotal[0]?.total || 0) / totalUsers : 0;
  
  return {
    users: {
      total: totalUsers,
      candidats: totalCandidates,
      recruteurs: totalRecruiters
    },
    companies: {
      total: totalCompanies
    },
    jobs: {
      total: totalJobs,
      active: activeJobs,
      applications: totalApplications,
      conversionRate: parseFloat(conversionRate)
    },
    revenue: {
      total: revenueTotal[0]?.total || 0,
      transactions: totalPayments,
      avgPerUser: avgRevenuePerUser
    }
  };
};

/**
 * Récupère la liste des utilisateurs avec filtres
 * @param {Object} filters - Filtres de recherche
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Utilisateurs paginés
 */
exports.getUsers = async (filters = {}, page = 1, limit = 25) => {
  const query = {};
  
  if (filters.role) {
    query.role = filters.role;
  }
  
  if (filters.search) {
    query.$or = [
      { nom: { $regex: filters.search, $options: 'i' } },
      { prenom: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  const skip = (page - 1) * limit;
  
  const users = await User.find(query)
    .select('-mot_de_passe')
    .populate('entreprise_id', 'nom')
    .sort({ date_creation: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await User.countDocuments(query);
  
  return {
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Récupère les détails d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Détails complets
 */
exports.getUserDetails = async (userId) => {
  const user = await User.findById(userId)
    .select('-mot_de_passe')
    .populate('entreprise_id');
  
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  // Récupérer les statistiques d'activité
  const [candidatures, offres, messages, paiements] = await Promise.all([
    user.role === 'candidat' ? Candidature.countDocuments({ utilisateur_id: userId }) : 0,
    user.role !== 'candidat' ? Offre.countDocuments({ recruteur_id: userId }) : 0,
    Message.countDocuments({ expediteur_id: userId }),
    Paiement.countDocuments({ utilisateur_id: userId, statut: 'success' })
  ]);
  
  return {
    user,
    stats: {
      candidatures,
      offres,
      messages,
      paiements
    }
  };
};

/**
 * Modère un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {string} action - Action de modération
 * @param {string} motif - Motif de l'action
 * @returns {Promise<Object>} Résultat de l'action
 */
exports.moderateUser = async (userId, action, motif) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  switch (action) {
    case 'suspendre':
      user.suspendu = true;
      user.date_suspension = new Date();
      user.motif_suspension = motif;
      break;
    case 'reactiver':
      user.suspendu = false;
      user.date_suspension = null;
      user.motif_suspension = null;
      break;
    case 'supprimer':
      // Marquer comme supprimé plutôt que supprimer définitivement
      user.supprime = true;
      user.date_suppression = new Date();
      user.motif_suppression = motif;
      break;
    default:
      throw new Error('Action de modération non valide');
  }
  
  await user.save();
  
  return {
    action,
    user: user.toPublicJSON(),
    motif
  };
};

/**
 * Récupère la liste des entreprises
 * @param {Object} filters - Filtres de recherche
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Entreprises paginées
 */
exports.getCompanies = async (filters = {}, page = 1, limit = 25) => {
  const query = {};
  
  if (filters.secteur) {
    query.secteur = filters.secteur;
  }
  
  if (filters.taille) {
    query.taille = filters.taille;
  }
  
  if (filters.plan) {
    query.plan_actif = filters.plan;
  }
  
  if (filters.search) {
    query.nom = { $regex: filters.search, $options: 'i' };
  }
  
  const skip = (page - 1) * limit;
  
  const companies = await Entreprise.find(query)
    .populate('admin_id', 'nom prenom email')
    .sort({ date_creation: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Entreprise.countDocuments(query);
  
  return {
    companies,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Récupère les détails d'une entreprise
 * @param {string} entrepriseId - ID de l'entreprise
 * @returns {Promise<Object>} Détails complets
 */
exports.getCompanyDetails = async (entrepriseId) => {
  const entreprise = await Entreprise.findById(entrepriseId)
    .populate('admin_id', 'nom prenom email');
  
  if (!entreprise) {
    throw new Error('Entreprise non trouvée');
  }
  
  // Récupérer les statistiques
  const [membres, offres, candidatures] = await Promise.all([
    User.countDocuments({ entreprise_id: entrepriseId }),
    Offre.countDocuments({ entreprise_id: entrepriseId }),
    Offre.aggregate([
      { $match: { entreprise_id: entreprise._id } },
      { $lookup: { from: 'candidatures', localField: '_id', foreignField: 'offre_id', as: 'candidatures' } },
      { $group: { _id: null, total: { $sum: { $size: '$candidatures' } } } }
    ])
  ]);
  
  return {
    entreprise,
    stats: {
      membres,
      offres,
      candidatures: candidatures[0]?.total || 0
    }
  };
};

/**
 * Récupère la liste des offres
 * @param {Object} filters - Filtres de recherche
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Offres paginées
 */
exports.getJobs = async (filters = {}, page = 1, limit = 25) => {
  const query = {};
  
  if (filters.statut) {
    query.statut = filters.statut;
  }
  
  if (filters.urgence !== undefined) {
    query.urgence = filters.urgence;
  }
  
  if (filters.entreprise_id) {
    query.entreprise_id = filters.entreprise_id;
  }
  
  const skip = (page - 1) * limit;
  
  const jobs = await Offre.find(query)
    .populate('entreprise_id', 'nom')
    .populate('recruteur_id', 'nom prenom')
    .sort({ date_creation: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Offre.countDocuments(query);
  
  return {
    jobs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Récupère l'historique des paiements
 * @param {Object} filters - Filtres de recherche
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Paiements paginés
 */
exports.getPayments = async (filters = {}, page = 1, limit = 25) => {
  const query = {};
  
  if (filters.statut) {
    query.statut = filters.statut;
  }
  
  if (filters.type) {
    query.type = filters.type;
  }
  
  if (filters.date_debut || filters.date_fin) {
    query.date = {};
    if (filters.date_debut) query.date.$gte = new Date(filters.date_debut);
    if (filters.date_fin) query.date.$lte = new Date(filters.date_fin);
  }
  
  const skip = (page - 1) * limit;
  
  const payments = await Paiement.find(query)
    .populate('utilisateur_id', 'nom prenom email')
    .populate('entreprise_id', 'nom')
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Paiement.countDocuments(query);
  
  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Récupère les données d'analytics
 * @param {string} periode - Période d'analyse
 * @returns {Promise<Object>} Données pour graphiques
 */
exports.getAnalytics = async (periode) => {
  const days = parseInt(periode.replace('d', ''));
  const dateDebut = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  // Évolution des inscriptions
  const inscriptions = await User.aggregate([
    {
      $match: {
        date_creation: { $gte: dateDebut }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date_creation' },
          month: { $month: '$date_creation' },
          day: { $dayOfMonth: '$date_creation' }
        },
        candidats: {
          $sum: { $cond: [{ $eq: ['$role', 'candidat'] }, 1, 0] }
        },
        recruteurs: {
          $sum: { $cond: [{ $ne: ['$role', 'candidat'] }, 1, 0] }
        }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
  
  // Évolution des revenus
  const revenus = await Paiement.aggregate([
    {
      $match: {
        date: { $gte: dateDebut },
        statut: 'success'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' }
        },
        total: { $sum: '$montant' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
  
  return {
    inscriptions,
    revenus,
    periode: `${days} derniers jours`
  };
};

/**
 * Exporte des données au format CSV
 * @param {string} type - Type de données
 * @param {Object} filters - Filtres d'export
 * @returns {Promise<string>} Données CSV
 */
exports.exportData = async (type, filters) => {
  let data = [];
  let headers = [];
  
  switch (type) {
    case 'users':
      headers = ['ID', 'Nom', 'Prénom', 'Email', 'Rôle', 'Date création', 'Premium'];
      const users = await User.find({}).select('-mot_de_passe').limit(1000);
      data = users.map(user => [
        user._id,
        user.nom,
        user.prenom,
        user.email,
        user.role,
        user.date_creation,
        user.premium ? 'Oui' : 'Non'
      ]);
      break;
      
    case 'companies':
      headers = ['ID', 'Nom', 'Secteur', 'Taille', 'Plan', 'Date création'];
      const companies = await Entreprise.find({}).limit(1000);
      data = companies.map(company => [
        company._id,
        company.nom,
        company.secteur,
        company.taille,
        company.plan_actif,
        company.date_creation
      ]);
      break;
      
    case 'payments':
      headers = ['ID', 'Utilisateur', 'Montant', 'Type', 'Statut', 'Date'];
      const payments = await Paiement.find({})
        .populate('utilisateur_id', 'nom prenom email')
        .limit(1000);
      data = payments.map(payment => [
        payment._id,
        payment.utilisateur_id ? `${payment.utilisateur_id.prenom} ${payment.utilisateur_id.nom}` : '',
        payment.montant,
        payment.type,
        payment.statut,
        payment.date
      ]);
      break;
      
    default:
      throw new Error('Type d\'export non supporté');
  }
  
  // Convertir en CSV
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  return csvContent;
};