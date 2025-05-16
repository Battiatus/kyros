/**
 * Modèle de message
 * @module models/Message
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma message pour MongoDB
 * @type {mongoose.Schema}
 */
const messageSchema = new Schema(
  {
    conversation_id: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },
    expediteur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contenu: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['texte', 'fichier', 'visio'],
      default: 'texte'
    },
    lu: {
      type: Boolean,
      default: false
    },
    date_lecture: {
      type: Date
    }
  },
  {
    timestamps: {
      createdAt: 'date_envoi'
    }
  }
);

messageSchema.index({ conversation_id: 1, date_envoi: 1 });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;