/**
 * Routes des fonctionnalités IA
 * @module routes/aiRoutes
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { isAuth, hasRole } = require('../middlewares/auth');

/**
 * @swagger
 * /api/v1/ai/optimize-job:
 *   post:
 *     summary: Optimise une offre d'emploi avec l'IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - offre_id
 *             properties:
 *               offre_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Offre optimisée avec succès
 *       403:
 *         description: Droits insuffisants
 */
router.post('/optimize-job', 
  isAuth, 
  hasRole(['recruteur', 'admin_entreprise', 'admin_plateforme']), 
  aiController.optimizeJobOffer
);

/**
 * @swagger
 * /api/v1/ai/analyze-cv:
 *   post:
 *     summary: Analyse un CV avec l'IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               target_job:
 *                 type: string
 *                 description: Poste ciblé pour l'analyse
 *     responses:
 *       200:
 *         description: CV analysé avec succès
 */
router.post('/analyze-cv', 
  isAuth, 
  hasRole(['candidat']), 
  aiController.analyzeCv
);

/**
 * @swagger
 * /api/v1/ai/advanced-matching:
 *   post:
 *     summary: Calcul de matching avancé avec IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidate_id
 *               - job_id
 *             properties:
 *               candidate_id:
 *                 type: string
 *               job_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Matching calculé avec succès
 */
router.post('/advanced-matching', 
  isAuth, 
  hasRole(['recruteur', 'admin_entreprise', 'admin_plateforme']), 
  aiController.advancedMatching
);

/**
 * @swagger
 * /api/v1/ai/interview-questions:
 *   post:
 *     summary: Génère des questions d'entretien IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *               - candidate_id
 *             properties:
 *               job_id:
 *                 type: string
 *               candidate_id:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [initial, technical, final]
 *     responses:
 *       200:
 *         description: Questions générées avec succès
 */
router.post('/interview-questions', 
  isAuth, 
  hasRole(['recruteur', 'admin_entreprise', 'admin_plateforme']), 
  aiController.generateInterviewQuestions
);

/**
 * @swagger
 * /api/v1/ai/generate-test:
 *   post:
 *     summary: Génère un test d'évaluation professionnel
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_id
 *             properties:
 *               job_id:
 *                 type: string
 *               test_type:
 *                 type: string
 *                 enum: [practical, theoretical, situational]
 *     responses:
 *       200:
 *         description: Test généré avec succès
 */
router.post('/generate-test', 
  isAuth, 
  hasRole(['recruteur', 'admin_entreprise', 'admin_plateforme']), 
  aiController.generateProfessionalTest
);

/**
 * @swagger
 * /api/v1/ai/evaluate-test:
 *   post:
 *     summary: Évalue les réponses d'un test avec l'IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - test
 *               - answers
 *             properties:
 *               test:
 *                 type: object
 *               answers:
 *                 type: object
 *     responses:
 *       200:
 *         description: Test évalué avec succès
 */
router.post('/evaluate-test', 
  isAuth, 
  aiController.evaluateTestAnswers
);

/**
 * @swagger
 * /api/v1/ai/generate-job-offer:
 *   post:
 *     summary: Génère une offre de recrutement personnalisée
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - candidate_id
 *               - job_id
 *             properties:
 *               candidate_id:
 *                 type: string
 *               job_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Offre générée avec succès
 */
router.post('/generate-job-offer', 
  isAuth, 
  hasRole(['recruteur', 'admin_entreprise', 'admin_plateforme']), 
  aiController.generateJobOffer
);

/**
 * @swagger
 * /api/v1/ai/profile-suggestions:
 *   post:
 *     summary: Obtient des suggestions pour améliorer le profil
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Suggestions générées avec succès
 */
router.post('/profile-suggestions', 
  isAuth, 
  hasRole(['candidat']), 
  aiController.getProfileSuggestions
);

/**
 * @swagger
 * /api/v1/ai/mock-interview:
 *   post:
 *     summary: Simulation d'entretien IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_type
 *             properties:
 *               job_type:
 *                 type: string
 *               previous_answer:
 *                 type: string
 *               question_number:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Entretien simulé mis à jour
 */
router.post('/mock-interview', 
  isAuth, 
  hasRole(['candidat']), 
  aiController.mockInterview
);

module.exports = router;