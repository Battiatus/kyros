/**
 * Configuration du logger de l'application
 * @module utils/logger
 */

const winston = require('winston');
const config = require('../config/config');

// Format de date pour les logs
const timezoned = () => {
  return new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris'
  });
};

// Configuration des formats
const formats = [
  winston.format.timestamp({ format: timezoned }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
];

// Création du logger
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(...formats),
  defaultMeta: { service: 'hereoz-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Si en développement, ajouter le transport console
if (config.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;