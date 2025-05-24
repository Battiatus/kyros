/**
 * Routes de gestion des messages
 * @module routes/messageRoutes
 */

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAuth } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/conversations:
 *   get:
 *     summary: Récupérer mes conversations
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des conversations
 */
router.get('/', isAuth, messageController.getConversations);

/**
 * @swagger
 * /api/v1/conversations:
 *   post:
 *     summary: Créer ou récupérer une conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participant_id
 *             properties:
 *               participant_id:
 *                 type: string
 *               offre_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Conversation créée ou récupérée
 */
router.post('/', isAuth, messageController.getOrCreateConversation);

/**
 * @swagger
 * /api/v1/conversations/{id}/messages:
 *   get:
 *     summary: Récupérer les messages d'une conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la conversation
 *     responses:
 *       200:
 *         description: Messages de la conversation
 */
router.get('/:id/messages', isAuth, messageController.getMessages);

/**
 * @swagger
 * /api/v1/conversations/{id}/messages:
 *   post:
 *     summary: Envoyer un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenu
 *             properties:
 *               contenu:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [texte, fichier, visio]
 *     responses:
 *       201:
 *         description: Message envoyé
 */
router.post('/:id/messages', isAuth, messageController.sendMessage);

/**
 * @swagger
 * /api/v1/conversations/{id}/read:
 *   put:
 *     summary: Marquer les messages comme lus
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la conversation
 *     responses:
 *       200:
 *         description: Messages marqués comme lus
 */
router.put('/:id/read', isAuth, messageController.markAsRead);

/**
 * @swagger
 * /api/v1/conversations/{id}/archive:
 *   put:
 *     summary: Archiver une conversation
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la conversation
 *     responses:
 *       200:
 *         description: Conversation archivée
 */
router.put('/:id/archive', isAuth, messageController.archiveConversation);

module.exports = router;