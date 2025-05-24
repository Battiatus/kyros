/**
 * Modèle de langue
 * @module models/Langue
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma langue pour MongoDB
 * @type {mongoose.Schema}
 */
const langueSchema = new Schema(
  {
    utilisateur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    langue: {
      type: String,
      required: true,
      trim: true
    },
    niveau: {
      type: String,
      enum: ['debutant', 'intermediaire', 'courant', 'bilingue', 'natif'],
      required: true
    },
    certifie: {
      type: Boolean,
      default: false
    },
    certification_nom: {
      type: String
    },
    certification_date: {
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

// Index composé pour éviter les doublons de langues pour un utilisateur
langueSchema.index({ utilisateur_id: 1, langue: 1 }, { unique: true });

const Langue = mongoose.model('Langue', langueSchema);

module.exports = Langue;