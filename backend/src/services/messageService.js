/**
 * Service de gestion des messages
 * @module services/messageService
 */

const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Offre = require('../models/Offre');
const { io } = require('../app');

/**
 * Récupère les conversations d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Conversations paginées
 */
exports.getUserConversations = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const query = {
    $or: [
      { candidat_id: userId },
      { recruteur_id: userId }
    ],
    statut: { $ne: 'archivee' }
  };
  
  const conversations = await Conversation.find(query)
    .populate('candidat_id', 'nom prenom photo_profil')
    .populate('recruteur_id', 'nom prenom photo_profil')
    .populate('offre_id', 'titre')
    .sort({ derniere_activite: -1 })
    .skip(skip)
    .limit(limit);
  
  // Ajouter le dernier message et le nombre de messages non lus
  const conversationsWithDetails = await Promise.all(
    conversations.map(async (conv) => {
      const lastMessage = await Message.findOne({ conversation_id: conv._id })
        .sort({ date_envoi: -1 });
      
      const unreadCount = await Message.countDocuments({
        conversation_id: conv._id,
        expediteur_id: { $ne: userId },
        lu: false
      });
      
      return {
        ...conv.toObject(),
        dernierMessage: lastMessage,
        messagesNonLus: unreadCount
      };
    })
  );
  
  const total = await Conversation.countDocuments(query);
  
  return {
    conversations: conversationsWithDetails,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Crée ou récupère une conversation existante
 * @param {string} userId - ID de l'utilisateur initiateur
 * @param {string} participantId - ID du participant
 * @param {string} offreId - ID de l'offre (optionnel)
 * @returns {Promise<Object>} Conversation
 */
exports.getOrCreateConversation = async (userId, participantId, offreId = null) => {
  // Déterminer qui est candidat et qui est recruteur
  const [user, participant] = await Promise.all([
    User.findById(userId),
    User.findById(participantId)
  ]);
  
  if (!user || !participant) {
    throw new Error('Utilisateur non trouvé');
  }
  
  let candidatId, recruteurId;
  
  if (user.role === 'candidat') {
    candidatId = userId;
    recruteurId = participantId;
  } else {
    candidatId = participantId;
    recruteurId = userId;
  }
  
  // Chercher une conversation existante
  let conversation = await Conversation.findOne({
    candidat_id: candidatId,
    recruteur_id: recruteurId,
    offre_id: offreId
  }).populate('candidat_id recruteur_id offre_id');
  
  // Créer une nouvelle conversation si elle n'existe pas
  if (!conversation) {
    conversation = new Conversation({
      candidat_id: candidatId,
      recruteur_id: recruteurId,
      offre_id: offreId
    });
    
    await conversation.save();
    await conversation.populate('candidat_id recruteur_id offre_id');
  }
  
  return conversation;
};

/**
 * Récupère les messages d'une conversation
 * @param {string} conversationId - ID de la conversation
 * @param {string} userId - ID de l'utilisateur
 * @param {number} page - Numéro de page
 * @param {number} limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Messages paginés
 */
exports.getConversationMessages = async (conversationId, userId, page = 1, limit = 50) => {
  // Vérifier que l'utilisateur participe à la conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation non trouvée');
  }
  
  if (conversation.candidat_id.toString() !== userId && 
      conversation.recruteur_id.toString() !== userId) {
    throw new Error('Accès refusé à cette conversation');
  }
  
  const skip = (page - 1) * limit;
  
  const messages = await Message.find({ conversation_id: conversationId })
    .populate('expediteur_id', 'nom prenom photo_profil')
    .sort({ date_envoi: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Message.countDocuments({ conversation_id: conversationId });
  
  return {
    messages: messages.reverse(), // Les plus anciens en premier
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Envoie un message dans une conversation
 * @param {string} conversationId - ID de la conversation
 * @param {string} senderId - ID de l'expéditeur
 * @param {string} contenu - Contenu du message
 * @param {string} type - Type de message
 * @returns {Promise<Object>} Message créé
 */
exports.sendMessage = async (conversationId, senderId, contenu, type = 'texte') => {
  // Vérifier que la conversation existe et que l'utilisateur y participe
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation non trouvée');
  }
  
  if (conversation.candidat_id.toString() !== senderId && 
      conversation.recruteur_id.toString() !== senderId) {
    throw new Error('Accès refusé à cette conversation');
  }
  
  // Créer le message
  const message = new Message({
    conversation_id: conversationId,
    expediteur_id: senderId,
    contenu,
    type
  });
  
  await message.save();
  await message.populate('expediteur_id', 'nom prenom photo_profil');
  
  // Mettre à jour l'activité de la conversation
  conversation.derniere_activite = new Date();
  await conversation.save();
  
  // Émettre le message via WebSocket
  if (io) {
    io.to(`conversation_${conversationId}`).emit('nouveau_message', {
      message: message.toObject(),
      conversationId
    });
  }
  
  return message;
};

/**
 * Marque les messages comme lus
 * @param {string} conversationId - ID de la conversation
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<void>}
 */
exports.markMessagesAsRead = async (conversationId, userId) => {
  await Message.updateMany(
    {
      conversation_id: conversationId,
      expediteur_id: { $ne: userId },
      lu: false
    },
    {
      lu: true,
      date_lecture: new Date()
    }
  );
  
  // Émettre la notification de lecture via WebSocket
  if (io) {
    io.to(`conversation_${conversationId}`).emit('messages_lus', {
      conversationId,
      userId
    });
  }
};

/**
 * Archive une conversation
 * @param {string} conversationId - ID de la conversation
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Conversation archivée
 */
exports.archiveConversation = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error('Conversation non trouvée');
  }
  
  if (conversation.candidat_id.toString() !== userId && 
      conversation.recruteur_id.toString() !== userId) {
    throw new Error('Accès refusé à cette conversation');
  }
  
  conversation.statut = 'archivee';
  await conversation.save();
  
  return conversation;
};