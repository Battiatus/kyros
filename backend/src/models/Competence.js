/**
 * Modèle de compétence candidat
 * @module models/Competence
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma compétence pour MongoDB
 * @type {mongoose.Schema}
 */
const competenceSchema = new Schema(
  {
    utilisateur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    competence: {
      type: String,
      required: true
    },
    niveau: {
      type: String,
      enum: ['debutant', 'intermediaire', 'expert'],
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

// Index composé pour éviter les doublons de compétences pour un utilisateur
competenceSchema.index({ utilisateur_id: 1, competence: 1 }, { unique: true });

const Competence = mongoose.model('Competence', competenceSchema);

module.exports = Competence;