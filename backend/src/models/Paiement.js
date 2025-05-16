/**
 * Modèle de paiement
 * @module models/Paiement
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schéma paiement pour MongoDB
 * @type {mongoose.Schema}
 */
const paiementSchema = new Schema(
  {
    utilisateur_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    entreprise_id: {
      type: Schema.Types.ObjectId,
      ref: 'Entreprise'
    },
    montant: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['abonnement_candidat', 'boost_candidat', 'forfait_entreprise', 'boost_offre'],
      required: true
    },
    duree: {
      type: Number, // En jours
      required: true
    },
    statut: {
      type: String,
      enum: ['success', 'echec', 'en_attente'],
      default: 'en_attente'
    },
    methode: {
      type: String,
      enum: ['carte', 'paypal', 'applepay', 'googlepay'],
      required: true
    },
    reference: {
      type: String,
      unique: true,
      required: true
    },
    stripe_payment_id: {
      type: String
    },
    stripe_customer_id: {
      type: String
    }
  },
  {
    timestamps: {
      createdAt: 'date'
    }
  }
);

const Paiement = mongoose.model('Paiement', paiementSchema);

module.exports = Paiement;