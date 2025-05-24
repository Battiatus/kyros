/**
 * Modèle de test d'évaluation
 * @module models/Test
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma test pour MongoDB
 * @type {mongoose.Schema}
 */
const testSchema = new Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true
    },
    entreprise_id: {
      type: Schema.Types.ObjectId,
      ref: 'Entreprise',
      required: true
    },
    type: {
      type: String,
      enum: ['qcm', 'mise_en_situation', 'pratique', 'redactionnel', 'autre'],
      required: true
    },
    contenu: {
      type: Object,
      required: true
    },
    duree: {
      type: Number,
      required: true // En minutes
    },
    note_maximale: {
      type: Number,
      default: 100
    },
    note_passage: {
      type: Number,
      default: 50
    },
    instructions: {
      type: String
    },
    actif: {
      type: Boolean,
      default: true
    },
    nombre_tentatives_max: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

// Index pour recherche par entreprise et type
testSchema.index({ entreprise_id: 1, type: 1 });
testSchema.index({ entreprise_id: 1, actif: 1 });

const Test = mongoose.model('Test', testSchema);

module.exports = Test;