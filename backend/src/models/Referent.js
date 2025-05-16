/**
 * Modèle de référent pour validation d'expérience
 * @module models/Referent
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma référent pour MongoDB
 * @type {mongoose.Schema}
 */
const referentSchema = new Schema(
  {
    experience_id: {
      type: Schema.Types.ObjectId,
      ref: 'Experience',
      required: true
    },
    nom: {
      type: String,
      required: true
    },
    prenom: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    telephone: {
      type: String
    },
    poste: {
      type: String,
      required: true
    },
    entreprise: {
      type: String,
      required: true
    },
    statut: {
      type: String,
      enum: ['en_attente', 'valide', 'refuse'],
      default: 'en_attente'
    },
    commentaire: {
      type: String
    },
    date_demande: {
      type: Date,
      default: Date.now
    },
    date_reponse: {
      type: Date
    },
    token_validation: {
      type: String,
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

const Referent = mongoose.model('Referent', referentSchema);

module.exports = Referent;