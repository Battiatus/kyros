/**
 * Middleware de validation des données
 * @module middlewares/validation
 */

const Joi = require('joi');

/**
 * Valide les données entrantes selon un schéma Joi
 * @param {Object} schema - Schéma Joi
 * @returns {Function} - Middleware Express
 */
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorDetails = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        message: 'Validation échouée',
        errors: errorDetails
      });
    }
    
    next();
  };
};

/**
 * Schéma de validation d'inscription
 */
exports.registerSchema = Joi.object({
  nom: Joi.string().required().trim().min(2).max(50),
  prenom: Joi.string().required().trim().min(2).max(50),
  email: Joi.string().required().email().trim().lowercase(),
  telephone: Joi.string().allow('').trim(),
  mot_de_passe: Joi.string().required().min(6).max(30),
  confirmation_mot_de_passe: Joi.string().valid(Joi.ref('mot_de_passe')).required()
    .messages({ 'any.only': 'Les mots de passe ne correspondent pas' }),
  role: Joi.string().valid('candidat', 'recruteur').required()
});

/**
 * Schéma de validation de connexion
 */
exports.loginSchema = Joi.object({
  email: Joi.string().required().email().trim().lowercase(),
  mot_de_passe: Joi.string().required()
});

/**
 * Schéma de validation mot de passe oublié
 */
exports.forgotPasswordSchema = Joi.object({
  email: Joi.string().required().email().trim().lowercase()
});

/**
 * Schéma de validation réinitialisation mot de passe
 */
exports.resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  mot_de_passe: Joi.string().required().min(6).max(30),
  confirmation_mot_de_passe: Joi.string().valid(Joi.ref('mot_de_passe')).required()
    .messages({ 'any.only': 'Les mots de passe ne correspondent pas' })
});

/**
 * Schéma de validation de création de profil entreprise
 */
exports.createEntrepriseSchema = Joi.object({
  nom: Joi.string().required().trim().min(2).max(100),
  domaine_email: Joi.string().trim().lowercase(),
  adresse: Joi.string().allow('').trim(),
  secteur: Joi.string().required().trim(),
  taille: Joi.string().valid('petite', 'moyenne', 'grande').required(),
  site_web: Joi.string().allow('').uri(),
  description: Joi.string().allow('').trim()
});

/**
 * Schéma de validation de création d'offre
 */
exports.createOffreSchema = Joi.object({
  titre: Joi.string().required().trim().min(5).max(100),
  description: Joi.string().required().trim().min(20),
  salaire_min: Joi.number().min(0),
  salaire_max: Joi.number().min(Joi.ref('salaire_min')),
  date_expiration: Joi.date().iso().required().greater('now'),
  date_embauche_souhaitee: Joi.date().iso().allow(null),
  localisation: Joi.string().required().trim(),
  type_contrat: Joi.string().valid('cdi', 'cdd', 'stage', 'freelance', 'autre').required(),
  remote: Joi.string().valid('non', 'hybride', 'full_remote').default('non'),
  horaires: Joi.string().allow('').trim(),
  tags_competences: Joi.array().items(Joi.string()).default([]),
  langues_requises: Joi.array().items(Joi.string()).default([]),
  experience_requise: Joi.number().integer().min(0).default(0),
  entretien_ia_auto: Joi.boolean().default(false),
  urgence: Joi.boolean().default(false)
});

/**
 * Schéma de validation pour les candidatures
 */
exports.candidatureSchema = Joi.object({
  offre_id: Joi.string().required().trim(),
  message_personnalise: Joi.string().allow('').trim()
});