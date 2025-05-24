/**
 * Modèle de disponibilité
 * @module models/Disponibilite
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma disponibilité pour MongoDB
 * @type {mongoose.Schema}
 */
const disponibiliteSchema = new Schema(
  {
    utilisateur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    jour: {
      type: Number,
      required: true,
      min: 0,
      max: 6 // 0 = Dimanche, 1 = Lundi, etc.
    },
    heure_debut: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    heure_fin: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    },
    recurrence: {
      type: String,
      enum: ['unique', 'hebdomadaire', 'mensuelle'],
      default: 'hebdomadaire'
    },
    date_specifique: {
      type: Date
    },
    fuseau_horaire: {
      type: String,
      default: 'Europe/Paris'
    },
    actif: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

// Index pour recherche rapide par utilisateur et jour
disponibiliteSchema.index({ utilisateur_id: 1, jour: 1 });
disponibiliteSchema.index({ utilisateur_id: 1, actif: 1 });

const Disponibilite = mongoose.model('Disponibilite', disponibiliteSchema);

module.exports = Disponibilite;