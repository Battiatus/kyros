/**
 * Middleware de gestion des erreurs
 * @module middlewares/error
 */

const logger = require('../utils/logger');

/**
 * Middleware de gestion des erreurs 404
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Function suivante Express
 */
exports.notFound = (req, res, next) => {
  const error = new Error(`Route non trouvée - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Middleware de gestion des erreurs générales
 * @param {Error} err - Erreur survenue
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Function suivante Express
 * @returns {Object} Réponse JSON avec l'erreur
 */
exports.errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log de l'erreur
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};