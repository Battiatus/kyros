/**
 * Routes de gestion des profils
 * @module routes/profileRoutes
 */

const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuth, hasRole } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');

/**
 * @swagger
 * /api/v1/profiles/me:
 *   get:
 *     summary: Récupérer mon profil complet
 *     tags: [Profils]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil complet
 *       401:
 *         description: Non authentifié
 */
router.get('/me', isAuth, profileController.getMyProfile);

/**
 * @swagger
 * /api/v1/profiles/me:
 *   put:
 *     summary: Mettre à jour mon profil
 *     tags: [Profils]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *               resume_pro:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.put('/me', isAuth, profileController.updateMyProfile);

// Routes pour les compétences
router.post('/me/competences', isAuth, hasRole(['candidat']), profileController.addCompetence);
router.delete('/me/competences/:id', isAuth, hasRole(['candidat']), profileController.removeCompetence);

// Routes pour les expériences
router.post('/me/experiences', isAuth, hasRole(['candidat']), profileController.addExperience);
router.put('/me/experiences/:id', isAuth, hasRole(['candidat']), profileController.updateExperience);
router.delete('/me/experiences/:id', isAuth, hasRole(['candidat']), profileController.removeExperience);

// Routes pour les référents
router.post('/me/experiences/:id/referents', isAuth, hasRole(['candidat']), profileController.addReferent);

// Routes pour les formations
router.post('/me/formations', isAuth, hasRole(['candidat']), profileController.addFormation);

// Routes pour les langues
router.post('/me/langues', isAuth, hasRole(['candidat']), profileController.addLangue);

// Routes pour les uploads
router.post('/me/photo', isAuth, uploadSingle('photo'), profileController.uploadProfilePhoto);
router.post('/me/cv', isAuth, uploadSingle('cv'), profileController.uploadCV);

// Route pour profil public
router.get('/:id', profileController.getPublicProfile);

module.exports = router;