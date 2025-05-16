/**
 * Modèle d'entretien
 * @module models/Entretien
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma entretien pour MongoDB
 * @type {mongoose.Schema}
 */
const entretienSchema = new Schema(
  {
    candidature_id: {
      type: Schema.Types.ObjectId,
      ref: 'Candidature',
      required: true
    },
    date_entretien: {
      type: Date,
      required: true
    },
    duree: {
      type: Number,
      required: true, // En minutes
      default: 30
    },
    mode: {
      type: String,
      enum: ['visio', 'physique'],
      required: true
    },
    statut: {
      type: String,
      enum: ['planifie', 'confirme', 'realise', 'annule'],
      default: 'planifie'
    },
    notes: {
      type: String
    },
    lien_visio: {
      type: String
    },
    lieu: {
      type: String
    },
    enregistrement: {
      type: String
    },
    compte_rendu_ia: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

const Entretien = mongoose.model('Entretien', entretienSchema);

module.exports = Entretien;