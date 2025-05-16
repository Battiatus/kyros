/**
 * Modèle d'entreprise
 * @module models/Entreprise
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma entreprise pour MongoDB
 * @type {mongoose.Schema}
 */
const entrepriseSchema = new Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String
    },
    domaine_email: {
      type: String,
      trim: true,
      lowercase: true
    },
    admin_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    adresse: {
      type: String
    },
    secteur: {
      type: String
    },
    taille: {
      type: String,
      enum: ['petite', 'moyenne', 'grande']
    },
    valeurs: {
      type: Object,
      default: {}
    },
    langues: {
      type: Array,
      default: []
    },
    site_web: {
      type: String
    },
    reseaux_sociaux: {
      type: Object,
      default: {}
    },
    description: {
      type: String
    },
    video_presentation: {
      type: String
    },
    avatar_genere: {
      type: Object,
      default: null
    },
    plan_actif: {
      type: String,
      enum: ['gratuit', 'basique', 'pro', 'enterprise'],
      default: 'gratuit'
    },
    date_expiration_plan: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

const Entreprise = mongoose.model('Entreprise', entrepriseSchema);

module.exports = Entreprise;