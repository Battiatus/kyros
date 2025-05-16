/**
 * Modèle d'offre d'emploi
 * @module models/Offre
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma offre pour MongoDB
 * @type {mongoose.Schema}
 */
const offreSchema = new Schema(
  {
    titre: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    salaire_min: {
      type: Number
    },
    salaire_max: {
      type: Number
    },
    entreprise_id: {
      type: Schema.Types.ObjectId,
      ref: 'Entreprise',
      required: true
    },
    recruteur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    statut: {
      type: String,
      enum: ['active', 'fermee', 'pourvue'],
      default: 'active'
    },
    date_expiration: {
      type: Date,
      required: true
    },
    date_embauche_souhaitee: {
      type: Date
    },
    localisation: {
      type: String,
      required: true
    },
    type_contrat: {
      type: String,
      enum: ['cdi', 'cdd', 'stage', 'freelance', 'autre'],
      required: true
    },
    remote: {
      type: String,
      enum: ['non', 'hybride', 'full_remote'],
      default: 'non'
    },
    horaires: {
      type: String
    },
    tags_competences: {
      type: Array,
      default: []
    },
    langues_requises: {
      type: Array,
      default: []
    },
    experience_requise: {
      type: Number, // En années
      default: 0
    },
    entretien_ia_auto: {
      type: Boolean,
      default: false
    },
    urgence: {
      type: Boolean,
      default: false
    },
    nb_vues: {
      type: Number,
      default: 0
    },
    nb_candidatures: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

// Index pour recherche rapide par statut et date expiration
offreSchema.index({ statut: 1, date_expiration: 1 });
offreSchema.index({ entreprise_id: 1, statut: 1 });
offreSchema.index({ tags_competences: 1 });
offreSchema.index({ localisation: 1 });

const Offre = mongoose.model('Offre', offreSchema);

module.exports = Offre;