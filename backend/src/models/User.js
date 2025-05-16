/**
 * Modèle d'utilisateur (candidat, recruteur, admin)
 * @module models/User
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

/**
 * Schéma utilisateur pour MongoDB
 * @type {mongoose.Schema}
 */
const userSchema = new Schema(
  {
    nom: {
      type: String,
      required: true,
      trim: true
    },
    prenom: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    telephone: {
      type: String,
      trim: true
    },
    mot_de_passe: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ['candidat', 'recruteur', 'admin_entreprise', 'admin_plateforme'],
      required: true
    },
    entreprise_id: {
      type: Schema.Types.ObjectId,
      ref: 'Entreprise'
    },
    date_naissance: {
      type: Date
    },
    nationalite: {
      type: String
    },
    adresse: {
      type: String
    },
    disponibilites: {
      type: Object,
      default: {}
    },
    photo_profil: {
      type: String
    },
    video_presentation: {
      type: String
    },
    avatar_genere: {
      type: Object,
      default: null
    },
    resume_pro: {
      type: String
    },
    premium: {
      type: Boolean,
      default: false
    },
    premium_expiration: {
      type: Date
    },
    boost_active: {
      type: Boolean,
      default: false
    },
    boost_expiration: {
      type: Date
    },
    derniere_connexion: {
      type: Date
    },
    validation_email: {
      type: Boolean,
      default: false
    },
    reset_token: {
      type: String
    },
    reset_token_expiration: {
      type: Date
    },
    oauth_profiles: {
      google: { type: String },
      linkedin: { type: String }
    }
  },
  {
    timestamps: {
      createdAt: 'date_creation',
      updatedAt: 'date_mise_a_jour'
    }
  }
);

/**
 * Pré-hook pour hacher le mot de passe avant de sauvegarder
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('mot_de_passe')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Méthode pour vérifier si le mot de passe correspond
 * @param {string} password - Mot de passe en clair
 * @returns {Promise<boolean>} Est valide ou non
 */
userSchema.methods.verifyPassword = async function(password) {
  return await bcrypt.compare(password, this.mot_de_passe);
};

/**
 * Méthode pour générer les informations utilisateur sans données sensibles
 * @returns {Object} Informations utilisateur sécurisées
 */
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  delete userObject.mot_de_passe;
  delete userObject.reset_token;
  delete userObject.reset_token_expiration;
  delete userObject.oauth_profiles;
  
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;