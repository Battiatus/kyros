/**
 * Service principal d'intelligence artificielle
 * @module services/aiService
 */

const bedrockService = require('./ai/bedrockService');
const vertexAIService = require('./ai/vertexAIService');
const openaiService = require('./ai/openaiService');
const aiConfig = require('../config/ai');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.providers = {
      bedrock: bedrockService,
      vertexAI: vertexAIService,
      openai: openaiService
    };
    this.usage = new Map();
  }

  /**
   * Route une tâche vers le meilleur provider disponible
   * @param {string} task - Type de tâche
   * @param {Object} payload - Données pour l'IA
   * @param {Object} options - Options de configuration
   * @returns {Promise<Object>} Résultat de l'IA
   */
  async executeTask(task, payload, options = {}) {
    const availableProviders = aiConfig.taskRouting[task] || ['bedrock.claude'];
    
    for (const provider of availableProviders) {
      try {
        const [serviceName, model] = provider.split('.');
        const service = this.providers[serviceName];
        
        if (await this.checkAvailability(serviceName)) {
          const result = await service.execute(model, payload, options);
          await this.trackUsage(serviceName, task, result.usage);
          return result;
        }
      } catch (error) {
        logger.warn(`Provider ${provider} failed for task ${task}:`, error.message);
        continue;
      }
    }
    
    throw new Error(`Aucun provider IA disponible pour la tâche: ${task}`);
  }

  /**
   * Optimise une offre d'emploi
   * @param {Object} offre - Données de l'offre
   * @param {Object} context - Contexte de l'entreprise
   * @returns {Promise<Object>} Offre optimisée
   */
  async optimizeJobOffer(offre, context = {}) {
    const prompt = this.buildJobOptimizationPrompt(offre, context);
    
    const result = await this.executeTask('jobOptimization', {
      prompt,
      maxTokens: 2000,
      temperature: 0.7
    });

    return {
      optimizedTitle: result.data.title,
      optimizedDescription: result.data.description,
      suggestedSkills: result.data.skills,
      improvementSuggestions: result.data.suggestions,
      score: result.data.score,
      reasoning: result.data.reasoning
    };
  }

  /**
   * Analyse et améliore un CV
   * @param {Object} cv - Données du CV
   * @param {string} targetJob - Poste ciblé
   * @returns {Promise<Object>} Analyse et suggestions
   */
  async analyzeCv(cv, targetJob = null) {
    const prompt = this.buildCvAnalysisPrompt(cv, targetJob);
    
    const result = await this.executeTask('cvAnalysis', {
      prompt,
      maxTokens: 2500,
      temperature: 0.3
    });

    return {
      score: result.data.score,
      strengths: result.data.strengths,
      weaknesses: result.data.weaknesses,
      suggestions: result.data.suggestions,
      missingSkills: result.data.missingSkills,
      optimizedSections: result.data.optimizedSections,
      matchingJobs: result.data.matchingJobs
    };
  }

  /**
   * Calcul de matching avancé avec IA
   * @param {Object} candidate - Profil candidat
   * @param {Object} job - Offre d'emploi
   * @returns {Promise<Object>} Score et analyse détaillée
   */
  async calculateAdvancedMatching(candidate, job) {
    const prompt = this.buildMatchingPrompt(candidate, job);
    
    const result = await this.executeTask('matching', {
      prompt,
      maxTokens: 1500,
      temperature: 0.2
    });

    return {
      overallScore: result.data.overallScore,
      skillsMatch: result.data.skillsMatch,
      experienceMatch: result.data.experienceMatch,
      culturalFit: result.data.culturalFit,
      strengths: result.data.strengths,
      concerns: result.data.concerns,
      recommendations: result.data.recommendations,
      explanation: result.data.explanation
    };
  }

  /**
   * Génère des questions d'entretien personnalisées
   * @param {Object} job - Offre d'emploi
   * @param {Object} candidate - Profil candidat
   * @param {string} level - Niveau d'entretien
   * @returns {Promise<Object>} Questions générées
   */
  async generateInterviewQuestions(job, candidate, level = 'initial') {
    const prompt = this.buildInterviewQuestionsPrompt(job, candidate, level);
    
    const result = await this.executeTask('interviewQuestions', {
      prompt,
      maxTokens: 2000,
      temperature: 0.8
    });

    return {
      technicalQuestions: result.data.technical,
      behavioralQuestions: result.data.behavioral,
      situationalQuestions: result.data.situational,
      companySpecificQuestions: result.data.companySpecific,
      evaluationCriteria: result.data.criteria,
      duration: result.data.suggestedDuration
    };
  }

  /**
   * Génère un test d'évaluation métier
   * @param {Object} job - Offre d'emploi
   * @param {string} type - Type de test
   * @returns {Promise<Object>} Test généré
   */
  async generateProfessionalTest(job, type = 'practical') {
    const prompt = this.buildTestGenerationPrompt(job, type);
    
    const result = await this.executeTask('testGeneration', {
      prompt,
      maxTokens: 3000,
      temperature: 0.6
    });

    return {
      testTitle: result.data.title,
      instructions: result.data.instructions,
      questions: result.data.questions,
      evaluationRubric: result.data.rubric,
      timeLimit: result.data.timeLimit,
      difficulty: result.data.difficulty
    };
  }

  /**
   * Évalue les réponses d'un test
   * @param {Object} test - Test original
   * @param {Object} answers - Réponses du candidat
   * @returns {Promise<Object>} Évaluation détaillée
   */
  async evaluateTestAnswers(test, answers) {
    const prompt = this.buildTestEvaluationPrompt(test, answers);
    
    const result = await this.executeTask('testGeneration', {
      prompt,
      maxTokens: 2000,
      temperature: 0.1
    });

    return {
      overallScore: result.data.score,
      detailedScores: result.data.detailed,
      feedback: result.data.feedback,
      strengths: result.data.strengths,
      improvements: result.data.improvements,
      recommendation: result.data.recommendation
    };
  }

  /**
   * Génère une offre de recrutement personnalisée
   * @param {Object} candidate - Profil candidat
   * @param {Object} job - Offre d'emploi
   * @param {Object} companyData - Données entreprise
   * @returns {Promise<Object>} Offre de recrutement
   */
  async generateJobOffer(candidate, job, companyData) {
    const prompt = this.buildJobOfferPrompt(candidate, job, companyData);
    
    const result = await this.executeTask('jobOptimization', {
      prompt,
      maxTokens: 2500,
      temperature: 0.5
    });

    return {
      offerLetter: result.data.letter,
      salaryRecommendation: result.data.salary,
      benefits: result.data.benefits,
      startDate: result.data.startDate,
      personalizedMessage: result.data.message,
      negotiationPoints: result.data.negotiation
    };
  }

  // Méthodes privées pour construire les prompts
  buildJobOptimizationPrompt(offre, context) {
    return `
En tant qu'expert en recrutement dans le secteur de l'hôtellerie-restauration, optimisez cette offre d'emploi pour attirer les meilleurs candidats.

OFFRE ACTUELLE:
Titre: ${offre.titre}
Description: ${offre.description}
Salaire: ${offre.salaire_min}-${offre.salaire_max}€
Localisation: ${offre.localisation}
Type de contrat: ${offre.type_contrat}

CONTEXTE ENTREPRISE:
${context.description || 'Non spécifié'}
Taille: ${context.taille || 'Non spécifiée'}
Valeurs: ${JSON.stringify(context.valeurs || {})}

CONSIGNES:
1. Réécrivez le titre pour qu'il soit plus attractif et descriptif
2. Améliorez la description en structurant mieux les informations
3. Suggérez des compétences spécifiques à mentionner
4. Proposez 3 améliorations concrètes
5. Donnez un score d'attractivité sur 10 et justifiez

Répondez en JSON avec cette structure:
{
  "title": "nouveau titre optimisé",
  "description": "description restructurée et améliorée",
  "skills": ["compétence1", "compétence2", ...],
  "suggestions": ["amélioration1", "amélioration2", "amélioration3"],
  "score": 8,
  "reasoning": "explication du score et des améliorations"
}
`;
  }

  buildCvAnalysisPrompt(cv, targetJob) {
    return `
En tant qu'expert RH spécialisé en hôtellerie-restauration, analysez ce CV et proposez des améliorations.

CV À ANALYSER:
Nom: ${cv.nom} ${cv.prenom}
Expériences: ${JSON.stringify(cv.experiences || [])}
Compétences: ${JSON.stringify(cv.competences || [])}
Formations: ${JSON.stringify(cv.formations || [])}
Langues: ${JSON.stringify(cv.langues || [])}

${targetJob ? `POSTE CIBLÉ: ${targetJob}` : ''}

CONSIGNES:
1. Évaluez la qualité du CV sur 100
2. Identifiez 3 points forts
3. Identifiez 3 points faibles
4. Proposez 5 suggestions d'amélioration concrètes
5. Listez les compétences manquantes importantes
6. Réécrivez les sections qui en ont besoin
7. Suggérez 3 types de postes qui correspondraient

Répondez en JSON:
{
  "score": 75,
  "strengths": ["point fort 1", ...],
  "weaknesses": ["point faible 1", ...],
  "suggestions": ["suggestion 1", ...],
  "missingSkills": ["compétence manquante 1", ...],
  "optimizedSections": {
    "summary": "résumé professionnel optimisé",
    "experiences": ["expérience réécrite 1", ...]
  },
  "matchingJobs": ["type de poste 1", "type de poste 2", "type de poste 3"]
}
`;
  }

  buildMatchingPrompt(candidate, job) {
    return `
Analysez la compatibilité entre ce candidat et cette offre d'emploi en tant qu'expert en recrutement hôtellerie-restauration.

CANDIDAT:
Expériences: ${JSON.stringify(candidate.experiences)}
Compétences: ${JSON.stringify(candidate.competences)}
Formations: ${JSON.stringify(candidate.formations)}

OFFRE:
Titre: ${job.titre}
Description: ${job.description}
Compétences requises: ${JSON.stringify(job.tags_competences)}
Expérience requise: ${job.experience_requise} ans

Calculez un score de compatibilité détaillé et expliquez votre raisonnement.

Répondez en JSON:
{
  "overallScore": 85,
  "skillsMatch": 90,
  "experienceMatch": 80,
  "culturalFit": 85,
  "strengths": ["point fort 1", ...],
  "concerns": ["préoccupation 1", ...],
  "recommendations": ["recommandation 1", ...],
  "explanation": "explication détaillée du matching"
}
`;
  }

  buildInterviewQuestionsPrompt(job, candidate, level) {
    return `
Générez des questions d'entretien personnalisées pour ce poste et ce candidat.

POSTE:
${job.titre}
${job.description}

CANDIDAT:
Expériences: ${JSON.stringify(candidate.experiences)}
Compétences: ${JSON.stringify(candidate.competences)}

NIVEAU D'ENTRETIEN: ${level}

Créez 4 types de questions (3 par type):
1. Questions techniques spécifiques au poste
2. Questions comportementales
3. Questions situationnelles avec mise en situation
4. Questions spécifiques à l'entreprise

Répondez en JSON:
{
  "technical": ["question technique 1", ...],
  "behavioral": ["question comportementale 1", ...],
  "situational": ["mise en situation 1", ...],
  "companySpecific": ["question entreprise 1", ...],
  "criteria": ["critère d'évaluation 1", ...],
  "suggestedDuration": "45 minutes"
}
`;
  }

  buildTestGenerationPrompt(job, type) {
    return `
Créez un test d'évaluation ${type} pour ce poste en hôtellerie-restauration.

POSTE:
${job.titre}
${job.description}
Compétences requises: ${JSON.stringify(job.tags_competences)}

TYPE DE TEST: ${type}

Générez:
1. Un titre accrocheur
2. Des instructions claires
3. 5 questions/exercices progressifs
4. Une grille d'évaluation détaillée
5. Une durée recommandée

Répondez en JSON:
{
  "title": "titre du test",
  "instructions": "instructions détaillées",
  "questions": [
    {
      "question": "énoncé",
      "type": "pratique/théorique/situation",
      "points": 20,
      "criteria": ["critère 1", ...]
    }
  ],
  "rubric": "grille d'évaluation complète",
  "timeLimit": "60 minutes",
  "difficulty": "intermédiaire"
}
`;
  }

  buildTestEvaluationPrompt(test, answers) {
    return `
Évaluez les réponses de ce candidat au test.

TEST:
${JSON.stringify(test)}

RÉPONSES:
${JSON.stringify(answers)}

Évaluez chaque réponse selon les critères du test et donnez:
1. Un score global sur 100
2. Des scores détaillés par question
3. Un feedback constructif
4. Les points forts identifiés
5. Les axes d'amélioration
6. Une recommandation finale

Répondez en JSON:
{
  "score": 75,
  "detailed": [
    {"question": 1, "score": 80, "feedback": "..."},
    ...
  ],
  "feedback": "feedback global constructif",
  "strengths": ["force 1", ...],
  "improvements": ["amélioration 1", ...],
  "recommendation": "recommandation finale"
}
`;
  }

  buildJobOfferPrompt(candidate, job, companyData) {
    return `
Rédigez une offre de recrutement personnalisée et attractive.

CANDIDAT:
Nom: ${candidate.nom} ${candidate.prenom}
Expériences: ${JSON.stringify(candidate.experiences)}
Compétences: ${JSON.stringify(candidate.competences)}

POSTE:
${job.titre}
Salaire: ${job.salaire_min}-${job.salaire_max}€

ENTREPRISE:
${companyData.nom}
${companyData.description}

Créez une offre complète avec:
1. Lettre d'offre personnalisée
2. Recommandation salariale justifiée
3. Package d'avantages attractif
4. Date de début suggérée
5. Message personnel du recruteur
6. Points de négociation anticipés

Répondez en JSON:
{
  "letter": "lettre d'offre complète et personnalisée",
  "salary": {
    "recommended": 3200,
    "justification": "justification de ce montant"
  },
  "benefits": ["avantage 1", "avantage 2", ...],
  "startDate": "2024-02-01",
  "message": "message personnel du recruteur",
  "negotiation": ["point négociable 1", ...]
}
`;
  }

  // Méthodes utilitaires
  async checkAvailability(serviceName) {
    try {
      return await this.providers[serviceName].isAvailable();
    } catch (error) {
      return false;
    }
  }

  async trackUsage(serviceName, task, usage) {
    if (!aiConfig.usage.costTracking) return;
    
    const key = `${serviceName}:${new Date().toISOString().split('T')[0]}`;
    const current = this.usage.get(key) || { requests: 0, tokens: 0, cost: 0 };
    
    current.requests += 1;
    current.tokens += usage.tokens || 0;
    current.cost += usage.cost || 0;
    
    this.usage.set(key, current);
    
    // Log si approche des limites
    if (current.requests > aiConfig.usage.maxRequestsPerDay * 0.8) {
      logger.warn(`Approche de la limite de requêtes pour ${serviceName}: ${current.requests}`);
    }
  }
}

module.exports = new AIService();