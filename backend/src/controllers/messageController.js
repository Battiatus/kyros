/**
 * Contrôleur de gestion des messages et conversations
 * @module controllers/messageController
 */

const messageService = require('../services/messageService');
const catchAsync = require('../utils/catchAsync');

/**
 * Récupérer les conversations de l'utilisateur
 * @route GET /api/v1/conversations
 * @group Messages - Opérations sur les messages et conversations
 * @param {Object} req.query - Paramètres de pagination
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des conversations
 */
exports.getConversations = catchAsync(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  const result = await messageService.getUserConversations(
    req.user._id,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.conversations,
    pagination: result.pagination
  });
});

/**
 * Créer ou récupérer une conversation
 * @route POST /api/v1/conversations
 * @group Messages - Opérations sur les messages et conversations
 * @param {Object} req.body - Données de la conversation
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Conversation créée ou existante
 */
exports.getOrCreateConversation = catchAsync(async (req, res) => {
  const { participant_id, offre_id } = req.body;
  
  const conversation = await messageService.getOrCreateConversation(
    req.user._id,
    participant_id,
    offre_id
  );
  
  res.status(200).json({
    success: true,
    data: { conversation }
  });
});

/**
 * Récupérer les messages d'une conversation
 * @route GET /api/v1/conversations/:id/messages
 * @group Messages - Opérations sur les messages et conversations
 * @param {string} req.params.id - ID de la conversation
 * @param {Object} req.query - Paramètres de pagination
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Liste des messages
 */
exports.getMessages = catchAsync(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  
  const result = await messageService.getConversationMessages(
    req.params.id,
    req.user._id,
    parseInt(page),
    parseInt(limit)
  );
  
  res.status(200).json({
    success: true,
    data: result.messages,
    pagination: result.pagination
  });
});

/**
 * Envoyer un message
 * @route POST /api/v1/conversations/:id/messages
 * @group Messages - Opérations sur les messages et conversations
 * @param {string} req.params.id - ID de la conversation
 * @param {Object} req.body - Contenu du message
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Message envoyé
 */
exports.sendMessage = catchAsync(async (req, res) => {
  const { contenu, type = 'texte' } = req.body;
  
  const message = await messageService.sendMessage(
    req.params.id,
    req.user._id,
    contenu,
    type
  );
  
  res.status(201).json({
    success: true,
    message: 'Message envoyé avec succès',
    data: { message }
  });
});

/**
 * Marquer les messages comme lus
 * @route PUT /api/v1/conversations/:id/read
 * @group Messages - Opérations sur les messages et conversations
 * @param {string} req.params.id - ID de la conversation
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Confirmation de lecture
 */
exports.markAsRead = catchAsync(async (req, res) => {
  await messageService.markMessagesAsRead(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    message: 'Messages marqués comme lus'
  });
});

/**
 * Archiver une conversation
 * @route PUT /api/v1/conversations/:id/archive
 * @group Messages - Opérations sur les messages et conversations
 * @param {string} req.params.id - ID de la conversation
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Conversation archivée
 */
exports.archiveConversation = catchAsync(async (req, res) => {
  const conversation = await messageService.archiveConversation(req.params.id, req.user._id);
  
  res.status(200).json({
    success: true,
    message: 'Conversation archivée',
    data: { conversation }
  });
});