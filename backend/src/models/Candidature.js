/**
 * Modèle de candidature
 * @module models/Candidature
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma candidature pour MongoDB
 * @type {mongoose.Schema}
 */
const candidatureSchema = new Schema(
  {
    utilisateur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    offre_id: {
      type: Schema.Types.ObjectId,
      ref: 'Offre',
      required: true
    },
    statut: {
      type: String,
      enum: ['non_vue', 'vue', 'favori', 'acceptee', 'rejetee', 'entretien', 'contrat', 'embauchee'],
      default: 'non_vue'
    },
    message_personnalise: {
      type: String
    },
    notes_recruteur: {
      type: String
    },
    motif_refus: {
      type: String
    },
    score_matching: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: 'date_candidature',
      updatedAt: 'date_maj_statut'
    }
  }
);

// Index pour éviter les candidatures dupliquées
candidatureSchema.index({ utilisateur_id: 1, offre_id: 1 }, { unique: true });
candidatureSchema.index({ offre_id: 1, statut: 1 });

const Candidature = mongoose.model('Candidature', candidatureSchema);

module.exports = Candidature;