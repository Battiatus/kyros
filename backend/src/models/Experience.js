/**
 * Modèle d'expérience professionnelle
 * @module models/Experience
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma expérience pour MongoDB
 * @type {mongoose.Schema}
 */
const experienceSchema = new Schema(
  {
    utilisateur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    poste: {
      type: String,
      required: true
    },
    entreprise: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    date_debut: {
      type: Date,
      required: true
    },
    date_fin: {
      type: Date
    },
    validated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;