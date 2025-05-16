/**
 * Configuration de la connexion à MongoDB
 * @module config/db
 */

const mongoose = require('mongoose');
const config = require('./config');
const logger = require('../utils/logger');

/**
 * Établit la connexion à MongoDB
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(config.db.uri, config.db.options);
    logger.info('MongoDB connecté avec succès');
  } catch (error) {
    logger.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Ferme la connexion à MongoDB
 * @returns {Promise<void>}
 */
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Connexion MongoDB fermée');
  } catch (error) {
    logger.error(`Erreur lors de la fermeture de la connexion MongoDB: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  closeDB
};