/**
 * Contrôleur d'administration
 * @module controllers/adminController
 */

const adminService = require('../services/adminService');
const catchAsync = require('../utils/catchAsync');

/**
 * Statistiques globales de la plateforme
 * @route GET /api/v1/admin/stats
 * @group Admin - Administration de la plateforme
 * @param {Object} req.query - Filtres de date
 * @param {Object} res - Réponse Express
 * @returns {Object} Statistiques globales
 */
exports.getGlobalStats = catchAsync(async (req, res) => {
  const { date_debut, date_fin } = req.query;
  
  const stats = await adminService.getGlobalStats(date_debut, date_fin);
  
  res.status(200).json({
    success: true,
    data: { stats }
  });
});

/**
 * Liste des utilisateurs avec filtres
 * @route GET /api/v1/admin/users
 * @group Admin - Administration de la plateforme
 * @param {Object} req.query - Filtres et pagination
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des utilisateurs
 */
exports.getUsers = catchAsync(async (req, res) => {
  const { page = 1, limit = 25, role, statut, search } = req.query;
  
  const filters = {};
  if (role) filters.role = role;
  if (statut) filters.statut = statut;
  if (search) filters.search = search;
  
  const result = await adminService.getUsers(
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.users,
    pagination: result.pagination
  });
});

/**
 * Détails d'un utilisateur
 * @route GET /api/v1/admin/users/:id
 * @group Admin - Administration de la plateforme
 * @param {string} req.params.id - ID de l'utilisateur
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails de l'utilisateur
 */
exports.getUserDetails = catchAsync(async (req, res) => {
  const userDetails = await adminService.getUserDetails(req.params.id);
  
  res.status(200).json({
    success: true,
    data: userDetails
  });
});

/**
 * Modérer un utilisateur
 * @route PUT /api/v1/admin/users/:id/moderate
 * @group Admin - Administration de la plateforme
 * @param {string} req.params.id - ID de l'utilisateur
 * @param {Object} req.body - Action de modération
 * @param {Object} res - Réponse Express
 * @returns {Object} Résultat de la modération
 */
exports.moderateUser = catchAsync(async (req, res) => {
  const { action, motif } = req.body;
  
  const result = await adminService.moderateUser(req.params.id, action, motif);
  
  res.status(200).json({
    success: true,
    message: `Utilisateur ${action} avec succès`,
    data: result
  });
});

/**
 * Liste des entreprises
 * @route GET /api/v1/admin/companies
 * @group Admin - Administration de la plateforme
 * @param {Object} req.query - Filtres et pagination
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des entreprises
 */
exports.getCompanies = catchAsync(async (req, res) => {
  const { page = 1, limit = 25, secteur, taille, plan, search } = req.query;
  
  const filters = {};
  if (secteur) filters.secteur = secteur;
  if (taille) filters.taille = taille;
  if (plan) filters.plan = plan;
  if (search) filters.search = search;
  
  const result = await adminService.getCompanies(
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.companies,
    pagination: result.pagination
  });
});

/**
 * Détails d'une entreprise
 * @route GET /api/v1/admin/companies/:id
 * @group Admin - Administration de la plateforme
 * @param {string} req.params.id - ID de l'entreprise
 * @param {Object} res - Réponse Express
 * @returns {Object} Détails de l'entreprise
 */
exports.getCompanyDetails = catchAsync(async (req, res) => {
  const companyDetails = await adminService.getCompanyDetails(req.params.id);
  
  res.status(200).json({
    success: true,
    data: companyDetails
  });
});

/**
 * Liste des offres
 * @route GET /api/v1/admin/jobs
 * @group Admin - Administration de la plateforme
 * @param {Object} req.query - Filtres et pagination
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des offres
 */
exports.getJobs = catchAsync(async (req, res) => {
  const { page = 1, limit = 25, statut, urgence, entreprise_id } = req.query;
  
  const filters = {};
  if (statut) filters.statut = statut;
  if (urgence) filters.urgence = urgence === 'true';
  if (entreprise_id) filters.entreprise_id = entreprise_id;
  
  const result = await adminService.getJobs(
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.jobs,
    pagination: result.pagination
  });
});

/**
 * Historique des paiements
 * @route GET /api/v1/admin/payments
 * @group Admin - Administration de la plateforme
 * @param {Object} req.query - Filtres et pagination
 * @param {Object} res - Réponse Express
 * @returns {Object} Historique des paiements
 */
exports.getPayments = catchAsync(async (req, res) => {
  const { page = 1, limit = 25, statut, type, date_debut, date_fin } = req.query;
  
  const filters = {};
  if (statut) filters.statut = statut;
  if (type) filters.type = type;
  if (date_debut) filters.date_debut = date_debut;
  if (date_fin) filters.date_fin = date_fin;
  
  const result = await adminService.getPayments(
    filters,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.payments,
    pagination: result.pagination
  });
});

/**
 * Graphiques et analytics
 * @route GET /api/v1/admin/analytics
 * @group Admin - Administration de la plateforme
 * @param {Object} req.query - Période d'analyse
 * @param {Object} res - Réponse Express
 * @returns {Object} Données pour graphiques
 */
exports.getAnalytics = catchAsync(async (req, res) => {
  const { periode = '30d' } = req.query;
  
  const analytics = await adminService.getAnalytics(periode);
  
  res.status(200).json({
    success: true,
    data: analytics
  });
});

/**
 * Exporter des données
 * @route GET /api/v1/admin/export/:type
 * @group Admin - Administration de la plateforme
 * @param {string} req.params.type - Type de données à exporter
 * @param {Object} req.query - Filtres d'export
 * @param {Object} res - Réponse Express
 * @returns {Object} Fichier d'export
 */
exports.exportData = catchAsync(async (req, res) => {
  const { type } = req.params;
  const filters = req.query;
  
  const exportData = await adminService.exportData(type, filters);
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${type}_export_${Date.now()}.csv`);
  res.status(200).send(exportData);
});