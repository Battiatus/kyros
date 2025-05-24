/**
 * Service de gestion des paiements
 * @module services/paymentService
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Paiement = require('../models/Paiement');
const User = require('../models/User');
const Entreprise = require('../models/Entreprise');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');

// Configuration des plans
const PLANS = {
  candidat_premium: {
    name: 'Premium Candidat',
    prices: {
      1: 9.99, // 1 mois
      12: 99.99 // 1 an
    },
    features: [
      'Statistiques avancées',
      'Candidatures illimitées',
      'Boost automatique',
      'Support prioritaire'
    ]
  },
  entreprise_basique: {
    name: 'Plan Basique Entreprise',
    prices: {
      1: 49.99,
      12: 499.99
    },
    features: [
      '10 offres actives',
      'Candidatures illimitées',
      'Statistiques de base'
    ]
  },
  entreprise_pro: {
    name: 'Plan Pro Entreprise',
    prices: {
      1: 99.99,
      12: 999.99
    },
    features: [
      'Offres illimitées',
      'Statistiques avancées',
      'IA d\'entretien',
      'Support prioritaire'
    ]
  },
  boost_candidat: {
    name: 'Boost Candidat',
    prices: {
      1: 4.99, // 1 jour
      7: 19.99, // 1 semaine
      30: 49.99 // 1 mois
    },
    features: [
      'Profil mis en avant',
      'Visibilité augmentée',
      'Badge premium'
    ]
  }
};

/**
 * Crée une session de paiement Stripe
 * @param {string} userId - ID de l'utilisateur
 * @param {string} type - Type de paiement
 * @param {number} duree - Durée en mois/jours
 * @param {string} plan - Plan sélectionné
 * @returns {Promise<Object>} Session Stripe
 */
exports.createPaymentSession = async (userId, type, duree, plan) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  // Vérifier que le plan existe
  if (!PLANS[plan]) {
    throw new Error('Plan non valide');
  }
  
  const planConfig = PLANS[plan];
  const price = planConfig.prices[duree];
  
  if (!price) {
    throw new Error('Durée non valide pour ce plan');
  }
  
  // Créer un enregistrement de paiement en attente
  const reference = uuidv4();
  const paiement = new Paiement({
    utilisateur_id: userId,
    entreprise_id: user.entreprise_id,
    montant: price,
    type,
    duree,
    reference,
    methode: 'carte'
  });
  
  await paiement.save();
  
  // Créer la session Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: planConfig.name,
            description: `${planConfig.name} - ${duree} ${duree === 1 ? 'mois' : 'mois'}`,
          },
          unit_amount: Math.round(price * 100), // Stripe utilise les centimes
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${config.frontendUrls.main}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.frontendUrls.main}/payment/cancel`,
    metadata: {
      payment_id: paiement._id.toString(),
      user_id: userId,
      type,
      plan
    }
  });
  
  // Mettre à jour le paiement avec l'ID de session
  paiement.stripe_payment_id = session.id;
  await paiement.save();
  
  return session;
};

/**
 * Vérifie le statut d'un paiement
 * @param {string} sessionId - ID de la session Stripe
 * @returns {Promise<Object>} Statut du paiement
 */
exports.getPaymentStatus = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    const paiement = await Paiement.findOne({ stripe_payment_id: sessionId });
    
    return {
      status: session.payment_status,
      amount: session.amount_total / 100,
      currency: session.currency,
      payment_id: paiement?._id
    };
  } catch (error) {
    throw new Error('Session de paiement non trouvée');
  }
};

/**
 * Récupère l'historique des paiements d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Historique paginé
 */
exports.getUserPaymentHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const payments = await Paiement.find({ utilisateur_id: userId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Paiement.countDocuments({ utilisateur_id: userId });
  
  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Annule l'abonnement d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<void>}
 */
exports.cancelUserSubscription = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  
  // Désactiver le premium
  user.premium = false;
  user.premium_expiration = null;
  user.boost_active = false;
  user.boost_expiration = null;
  
  await user.save();
  
  // Si c'est une entreprise, mettre à jour le plan
  if (user.entreprise_id) {
    const entreprise = await Entreprise.findById(user.entreprise_id);
    if (entreprise) {
      entreprise.plan_actif = 'gratuit';
      entreprise.date_expiration_plan = null;
      await entreprise.save();
    }
  }
};

/**
 * Gère les webhooks Stripe
 * @param {Buffer} body - Corps de la requête
 * @param {string} signature - Signature Stripe
 * @returns {Promise<void>}
 */
exports.handleStripeWebhook = async (body, signature) => {
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(body, signature, config.stripe.webhookSecret);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

/**
 * Récupère les plans disponibles
 * @returns {Promise<Object>} Plans disponibles
 */
exports.getAvailablePlans = async () => {
  return PLANS;
};

/**
 * Traite un paiement réussi
 * @param {Object} session - Session Stripe
 * @returns {Promise<void>}
 */
async function handleSuccessfulPayment(session) {
  const paiement = await Paiement.findOne({ stripe_payment_id: session.id });
  
  if (!paiement) {
    console.error('Paiement non trouvé pour la session:', session.id);
    return;
  }
  
  // Mettre à jour le statut du paiement
  paiement.statut = 'success';
  await paiement.save();
  
  // Activer les fonctionnalités premium
  const user = await User.findById(paiement.utilisateur_id);
  
  if (paiement.type === 'abonnement_candidat') {
    user.premium = true;
    user.premium_expiration = new Date(Date.now() + paiement.duree * 30 * 24 * 60 * 60 * 1000);
  } else if (paiement.type === 'boost_candidat') {
    user.boost_active = true;
    user.boost_expiration = new Date(Date.now() + paiement.duree * 24 * 60 * 60 * 1000);
  } else if (paiement.type === 'forfait_entreprise') {
    const entreprise = await Entreprise.findById(user.entreprise_id);
    if (entreprise) {
      entreprise.plan_actif = session.metadata.plan.includes('pro') ? 'pro' : 'basique';
      entreprise.date_expiration_plan = new Date(Date.now() + paiement.duree * 30 * 24 * 60 * 60 * 1000);
      await entreprise.save();
    }
  }
  
  await user.save();
}

/**
 * Traite un paiement échoué
 * @param {Object} paymentIntent - Intent de paiement Stripe
 * @returns {Promise<void>}
 */
async function handleFailedPayment(paymentIntent) {
  const paiement = await Paiement.findOne({ stripe_payment_id: paymentIntent.id });
  
  if (paiement) {
    paiement.statut = 'echec';
    await paiement.save();
  }
}