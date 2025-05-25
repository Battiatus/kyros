const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Matching
router.post('/matching/job/:jobId', auth, AIController.matchCandidateToJob);
router.get('/matching/job/:jobId/best-matches', auth, roleAuth(['recruiter']), AIController.findBestMatches);
router.get('/matching/history', auth, AIController.getMatchingHistory);

// Génération CV (candidats)
router.post('/generate-cv', auth, roleAuth(['candidate']), AIController.generateCV);
router.post('/improve-cv-section', auth, roleAuth(['candidate']), AIController.improveCVSection);

// Génération offres d'emploi (recruteurs)
router.post('/generate-job-offer', auth, roleAuth(['recruiter']), AIController.generateJobOffer);
router.post('/optimize-job-offer-seo', auth, roleAuth(['recruiter']), AIController.optimizeJobOfferSEO);

// Génération de tests (recruteurs)
router.post('/generate-technical-test', auth, roleAuth(['recruiter']), AIController.generateTechnicalTest);
router.post('/generate-softskills-test', auth, roleAuth(['recruiter']), AIController.generateSoftSkillsTest);
router.post('/generate-interview-questions', auth, roleAuth(['recruiter']), AIController.generateInterviewQuestions);

// Historique et gestion
router.get('/generated-content', auth, AIController.getGeneratedContent);

module.exports = router;