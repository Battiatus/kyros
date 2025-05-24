/**
 * Modèle d'historique de swipe
 * @module models/SwipeHistorique
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma historique de swipe pour MongoDB
 * @type {mongoose.Schema}
 */
const swipeHistoriqueSchema = new Schema(
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
    action: {
      type: String,
      enum: ['droite', 'gauche', 'favori'],
      required: true
    },
    motif_rejet: {
      type: String
    },
    score_matching: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: {
      createdAt: 'date',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

// Index pour éviter les actions multiples sur la même offre
swipeHistoriqueSchema.index({ utilisateur_id: 1, offre_id: 1 }, { unique: true });
swipeHistoriqueSchema.index({ utilisateur_id: 1, action: 1 });
swipeHistoriqueSchema.index({ offre_id: 1, action: 1 });

const SwipeHistorique = mongoose.model('SwipeHistorique', swipeHistoriqueSchema);

module.exports = SwipeHistorique;