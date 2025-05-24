/**
 * Contrôleur des fonctionnalités IA
 * @module controllers/aiController
 */

const aiService = require('../services/aiService');
const catchAsync = require('../utils/catchAsync');
const Offre = require('../models/Offre');
const User = require('../models/User');
const Candidature = require('../models/Candidature');

/**
 * Optimise une offre d'emploi avec l'IA
 * @route POST /api/v1/ai/optimize-job
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.body - Données de l'offre à optimiser
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Offre optimisée
 */
exports.optimizeJobOffer = catchAsync(async (req, res) => {
  const { offre_id } = req.body;
  
  const offre = await Offre.findById(offre_id).populate('entreprise_id');
  if (!offre) {
    return res.status(404).json({
      success: false,
      message: 'Offre non trouvée'
    });
  }

  // Vérifier les droits
  if (offre.recruteur_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin_plateforme') {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour optimiser cette offre'
    });
  }

  const optimization = await aiService.optimizeJobOffer(offre, {
    description: offre.entreprise_id?.description,
    taille: offre.entreprise_id?.taille,
    valeurs: offre.entreprise_id?.valeurs
  });

  res.status(200).json({
    success: true,
    message: 'Offre optimisée avec succès',
    data: optimization
  });
});

/**
 * Analyse un CV avec l'IA
 * @route POST /api/v1/ai/analyze-cv
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.body - Données pour l'analyse
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Analyse du CV
 */
exports.analyzeCv = catchAsync(async (req, res) => {
  const { target_job } = req.body;
  
  // Récupérer le profil complet de l'utilisateur
  const profileService = require('../services/profileService');
  const profile = await profileService.getFullProfile(req.user._id);

  const analysis = await aiService.analyzeCv(profile, target_job);

  res.status(200).json({
    success: true,
    message: 'CV analysé avec succès',
    data: analysis
  });
});

/**
 * Calcul de matching avancé avec IA
 * @route POST /api/v1/ai/advanced-matching
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.body - IDs candidat et offre
 * @param {Object} res - Réponse Express
 * @returns {Object} Analyse de matching détaillée
 */
exports.advancedMatching = catchAsync(async (req, res) => {
  const { candidate_id, job_id } = req.body;

  const [candidate, job] = await Promise.all([
    User.findById(candidate_id),
    Offre.findById(job_id)
  ]);

  if (!candidate || !job) {
    return res.status(404).json({
      success: false,
      message: 'Candidat ou offre non trouvé'
    });
  }

  // Récupérer le profil complet du candidat
  const profileService = require('../services/profileService');
  const candidateProfile = await profileService.getFullProfile(candidate_id);

  const matching = await aiService.calculateAdvancedMatching(candidateProfile, job);

  res.status(200).json({
    success: true,
    message: 'Matching calculé avec succès',
    data: matching
  });
});

/**
 * Génère des questions d'entretien IA
 * @route POST /api/v1/ai/interview-questions
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.body - Données pour générer les questions
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Questions d'entretien générées
 */
exports.generateInterviewQuestions = catchAsync(async (req, res) => {
  const { job_id, candidate_id, level = 'initial' } = req.body;

  const [job, candidate] = await Promise.all([
    Offre.findById(job_id),
    User.findById(candidate_id)
  ]);

  if (!job || !candidate) {
    return res.status(404).json({
      success: false,
      message: 'Offre ou candidat non trouvé'
    });
  }

  // Vérifier les droits
  if (job.recruteur_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin_plateforme') {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour cette offre'
    });
  }

  const profileService = require('../services/profileService');
  const candidateProfile = await profileService.getFullProfile(candidate_id);

  const questions = await aiService.generateInterviewQuestions(job, candidateProfile, level);

  res.status(200).json({
    success: true,
    message: 'Questions d\'entretien générées avec succès',
    data: questions
  });
});

/**
 * Génère un test d'évaluation professionnel
 * @route POST /api/v1/ai/generate-test
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.body - Données pour le test
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Test généré
 */
exports.generateProfessionalTest = catchAsync(async (req, res) => {
  const { job_id, test_type = 'practical' } = req.body;

  const job = await Offre.findById(job_id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Offre non trouvée'
    });
  }

  // Vérifier les droits
  if (job.recruteur_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin_plateforme') {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour cette offre'
    });
  }

  const test = await aiService.generateProfessionalTest(job, test_type);

  res.status(200).json({
    success: true,
    message: 'Test généré avec succès',
    data: test
  });
});

/**
 * Évalue les réponses d'un test avec l'IA
 * @route POST /api/v1/ai/evaluate-test
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.body - Test et réponses
 * @param {Object} res - Réponse Express
 * @returns {Object} Évaluation détaillée
 */
exports.evaluateTestAnswers = catchAsync(async (req, res) => {
  const { test, answers } = req.body;

  if (!test || !answers) {
    return res.status(400).json({
      success: false,
      message: 'Test et réponses requis'
    });
  }

  const evaluation = await aiService.evaluateTestAnswers(test, answers);

  res.status(200).json({
    success: true,
    message: 'Test évalué avec succès',
    data: evaluation
  });
});

/**
 * Génère une offre de recrutement personnalisée
 * @route POST /api/v1/ai/generate-job-offer
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.body - Données pour l'offre
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Offre de recrutement générée
 */
exports.generateJobOffer = catchAsync(async (req, res) => {
  const { candidate_id, job_id } = req.body;

  const [candidate, job] = await Promise.all([
    User.findById(candidate_id),
    Offre.findById(job_id).populate('entreprise_id')
  ]);

  if (!candidate || !job) {
    return res.status(404).json({
      success: false,
      message: 'Candidat ou offre non trouvé'
    });
  }

  // Vérifier les droits
  if (job.recruteur_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin_plateforme') {
    return res.status(403).json({
      success: false,
      message: 'Vous n\'avez pas les droits pour cette offre'
    });
  }

  const profileService = require('../services/profileService');
  const candidateProfile = await profileService.getFullProfile(candidate_id);

  const jobOffer = await aiService.generateJobOffer(
    candidateProfile, 
    job, 
    job.entreprise_id
  );

  res.status(200).json({
    success: true,
    message: 'Offre de recrutement générée avec succès',
    data: jobOffer
  });
});

/**
 * Obtient des suggestions intelligentes pour compléter un profil
 * @route POST /api/v1/ai/profile-suggestions
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Suggestions pour le profil
 */
exports.getProfileSuggestions = catchAsync(async (req, res) => {
  const profileService = require('../services/profileService');
  const profile = await profileService.getFullProfile(req.user._id);

  // Analyser le profil et suggérer des améliorations
  const suggestions = await aiService.analyzeCv(profile, null);

  res.status(200).json({
    success: true,
    message: 'Suggestions de profil générées',
    data: {
      currentScore: suggestions.score,
      missingElements: suggestions.missingSkills,
      suggestions: suggestions.suggestions,
      nextSteps: suggestions.optimizedSections
    }
  });
});

/**
 * Simulation d'entretien IA
 * @route POST /api/v1/ai/mock-interview
 * @group IA - Fonctionnalités d'intelligence artificielle
 * @param {Object} req.body - Question ou réponse pour l'entretien
 * @param {Object} req.user - Utilisateur authentifié
 * @param {Object} res - Réponse Express
 * @returns {Object} Question suivante ou feedback
 */
exports.mockInterview = catchAsync(async (req, res) => {
  const { job_type, previous_answer, question_number = 1 } = req.body;

  const profileService = require('../services/profileService');
  const profile = await profileService.getFullProfile(req.user._id);

  // Créer un entretien simulé adaptatif
  const prompt = `
En tant qu'expert RH, menez un entretien d'embauche simulé pour un poste de ${job_type}.

CANDIDAT:
${JSON.stringify(profile)}

${previous_answer ? `RÉPONSE PRÉCÉDENTE DU CANDIDAT: ${previous_answer}` : ''}

QUESTION NUMÉRO: ${question_number}

${previous_answer ? 
  'Donnez un feedback constructif sur cette réponse puis posez la question suivante.' : 
  'Posez la première question d\'entretien.'}

Répondez en JSON:
{
  "feedback": "${previous_answer ? 'feedback sur la réponse' : null}",
  "nextQuestion": "prochaine question adaptée",
  "tips": ["conseil 1", "conseil 2"],
  "questionType": "technique/comportementale/situationnelle",
  "expectedDuration": "2-3 minutes"
}
`;

  const result = await aiService.executeTask('interviewQuestions', {
    prompt,
    maxTokens: 1500,
    temperature: 0.8
  });

  res.status(200).json({
    success: true,
    message: 'Entretien simulé mis à jour',
    data: result.data
  });
});