/**
 * Utilitaire pour gérer les erreurs asynchrones
 * @module utils/catchAsync
 */

/**
 * Wrapper pour les fonctions asynchrones des contrôleurs
 * Permet de capturer les erreurs sans try/catch
 * @param {Function} fn - Fonction asynchrone à wrapper
 * @returns {Function} Middleware Express avec gestion d'erreur
 */
module.exports = fn => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };