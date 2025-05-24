/**
 * Modèle de formation
 * @module models/Formation
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma formation pour MongoDB
 * @type {mongoose.Schema}
 */
const formationSchema = new Schema(
  {
    utilisateur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    diplome: {
      type: String,
      required: true,
      trim: true
    },
    etablissement: {
      type: String,
      required: true,
      trim: true
    },
    date_debut: {
      type: Date,
      required: true
    },
    date_fin: {
      type: Date
    },
    description: {
      type: String,
      trim: true
    },
    niveau: {
      type: String,
      enum: ['bac', 'bac+2', 'bac+3', 'bac+5', 'doctorat', 'autre']
    },
    domaine: {
      type: String,
      trim: true
    },
    obtenu: {
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

// Index pour recherche par utilisateur et tri par date
formationSchema.index({ utilisateur_id: 1, date_debut: -1 });

const Formation = mongoose.model('Formation', formationSchema);

module.exports = Formation;