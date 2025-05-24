/**
 * Routes de gestion des entreprises
 * @module routes/entrepriseRoutes
 */

const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');
const { isAuth, hasRole, isCompanyAdmin } = require('../middlewares/auth');
const { validate, createEntrepriseSchema } = require('../middlewares/validation');

/**
 * @swagger
 * /api/v1/companies:
 *   post:
 *     summary: Création d'une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEntreprise'
 *     responses:
 *       201:
 *         description: Entreprise créée
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 */
router.post('/', isAuth, hasRole(['recruteur', 'admin_entreprise']), validate(createEntrepriseSchema), entrepriseController.createEntreprise);

/**
 * @swagger
 * /api/v1/companies/{id}:
 *   get:
 *     summary: Détails d'une entreprise
 *     tags: [Entreprises]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'entreprise
 *     responses:
 *       200:
 *         description: Détails de l'entreprise
 *       404:
 *         description: Entreprise non trouvée
 */
router.get('/:id', entrepriseController.getEntreprise);

/**
 * @swagger
 * /api/v1/companies/{id}:
 *   put:
 *     summary: Mise à jour d'une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'entreprise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEntreprise'
 *     responses:
 *       200:
 *         description: Entreprise mise à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Entreprise non trouvée
 */
router.put('/:id', isAuth, entrepriseController.updateEntreprise);

/**
 * @swagger
 * /api/v1/companies/{id}/profile:
 *   put:
 *     summary: Mise à jour du profil d'une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'entreprise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfilEntreprise'
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Entreprise non trouvée
 */
router.put('/:id/profile', isAuth, entrepriseController.updateProfilEntreprise);

/**
 * @swagger
 * /api/v1/companies/{id}/members:
 *   post:
 *     summary: Ajout d'un membre à l'entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'entreprise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [recruteur, admin_entreprise]
 *                 default: recruteur
 *     responses:
 *       200:
 *         description: Membre ajouté
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur ou entreprise non trouvé
 */
router.post('/:id/members', isAuth, isCompanyAdmin, entrepriseController.addMember);

/**
 * @swagger
 * /api/v1/companies/{id}/members:
 *   get:
 *     summary: Liste des membres d'une entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'entreprise
 *     responses:
 *       200:
 *         description: Liste des membres
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Entreprise non trouvée
 */
router.get('/:id/members', isAuth, entrepriseController.getMembers);

module.exports = router;