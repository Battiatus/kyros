/**
 * Modèle de résultat de test
 * @module models/ResultatTest
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma résultat de test pour MongoDB
 * @type {mongoose.Schema}
 */
const resultatTestSchema = new Schema(
  {
    test_id: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
      required: true
    },
    candidat_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    candidature_id: {
      type: Schema.Types.ObjectId,
      ref: 'Candidature'
    },
    score: {
      type: Number,
      required: true,
      min: 0
    },
    note_max: {
      type: Number,
      required: true
    },
    pourcentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    reponses: {
      type: Object,
      required: true
    },
    duree_reelle: {
      type: Number, // En secondes
      required: true
    },
    statut: {
      type: String,
      enum: ['en_cours', 'termine', 'abandonne', 'expire'],
      default: 'en_cours'
    },
    analyse_ia: {
      type: Object,
      default: {}
    },
    feedback: {
      type: String
    },
    reussi: {
      type: Boolean,
      default: false
    },
    tentative_numero: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: {
      createdAt: 'date_debut',
      updatedAt: 'date_fin'
    }
  }
);

// Index pour recherche et tri
resultatTestSchema.index({ candidat_id: 1, test_id: 1 });
resultatTestSchema.index({ candidature_id: 1 });
resultatTestSchema.index({ test_id: 1, score: -1 });

const ResultatTest = mongoose.model('ResultatTest', resultatTestSchema);

module.exports = ResultatTest;