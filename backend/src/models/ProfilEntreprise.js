/**
 * Modèle de profil détaillé d'entreprise
 * @module models/ProfilEntreprise
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma de profil entreprise pour MongoDB
 * @type {mongoose.Schema}
 */
const profilEntrepriseSchema = new Schema(
  {
    entreprise_id: {
      type: Schema.Types.ObjectId,
      ref: 'Entreprise',
      required: true
    },
    description_complete: {
      type: String
    },
    ambiance_travail: {
      type: String
    },
    avantages: {
      type: Object,
      default: {}
    },
    valeurs_entreprise: {
      type: Object,
      default: {}
    },
    pourcentage_completion: {
      type: Number,
      default: 0
    },
    badge_complete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

const ProfilEntreprise = mongoose.model('ProfilEntreprise', profilEntrepriseSchema);

module.exports = ProfilEntreprise;