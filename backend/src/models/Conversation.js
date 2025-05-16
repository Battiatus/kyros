/**
 * Modèle de conversation
 * @module models/Conversation
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma conversation pour MongoDB
 * @type {mongoose.Schema}
 */
const conversationSchema = new Schema(
  {
    candidat_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recruteur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    offre_id: {
      type: Schema.Types.ObjectId,
      ref: 'Offre'
    },
    statut: {
      type: String,
      enum: ['ouverte', 'fermee', 'archivee'],
      default: 'ouverte'
    },
    derniere_activite: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation'
    }
  }
);

// Index pour trouver les conversations d'un utilisateur efficacement
conversationSchema.index({ candidat_id: 1, statut: 1 });
conversationSchema.index({ recruteur_id: 1, statut: 1 });
// Index pour trouver la conversation entre deux utilisateurs pour une offre
conversationSchema.index({ candidat_id: 1, recruteur_id: 1, offre_id: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;