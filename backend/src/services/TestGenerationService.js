const AIOrchestrationService = require('./ai/AIOrchestrationService');

class TestGenerationService {
  async generateTechnicalTest(jobDetails, difficulty = 'intermediate') {
    try {
      const prompt = this.buildTestPrompt(jobDetails, difficulty, 'technical');
      
      const { result, provider } = await AIOrchestrationService.generateWithFallback(
        ['claude', 'deepseek', 'openai'],
        prompt,
        { maxTokens: 4000, temperature: 0.7 }
      );

      return {
        content: result,
        type: 'technical',
        difficulty,
        jobDetails,
        aiProvider: provider,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erreur génération test technique:', error);
      throw error;
    }
  }

  async generateSoftSkillsTest(jobDetails) {
    try {
      const prompt = this.buildTestPrompt(jobDetails, 'intermediate', 'softskills');
      
      const { result, provider } = await AIOrchestrationService.generateWithFallback(
        ['claude', 'gemini', 'openai'],
        prompt,
        { maxTokens: 3000, temperature: 0.8 }
      );

      return {
        content: result,
        type: 'softskills',
        jobDetails,
        aiProvider: provider,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erreur génération test soft skills:', error);
      throw error;
    }
  }

  buildTestPrompt(jobDetails, difficulty, testType) {
    const { title, skills, experienceLevel, description } = jobDetails;

    if (testType === 'technical') {
      return `
Génère un test technique complet pour le poste suivant.

DÉTAILS DU POSTE:
- Titre: ${title}
- Compétences: ${skills?.join(', ') || 'Non spécifiées'}
- Niveau: ${experienceLevel}
- Description: ${description}

NIVEAU DE DIFFICULTÉ: ${difficulty}

Instructions:
1. Crée 15-20 questions variées (QCM, questions ouvertes, exercices pratiques)
2. Couvre les compétences techniques essentielles
3. Inclus des questions de code si pertinent
4. Ajoute des cas pratiques réalistes
5. Fournis les réponses et critères d'évaluation
6. Estime le temps de réalisation

Format JSON:
{
  "title": "Titre du test",
  "description": "Description du test",
  "estimatedTime": "temps en minutes",
  "questions": [
    {
      "id": 1,
      "type": "mcq|open|practical",
      "question": "énoncé",
      "options": ["option1", "option2"] // pour MCQ uniquement,
      "correctAnswer": "réponse correcte",
      "explanation": "explication de la réponse",
      "points": 5
    }
  ],
  "totalPoints": 100,
  "evaluationCriteria": ["critère 1", "critère 2"]
}
`;
    } else {
      return `
Génère un test de soft skills et de personnalité pour le poste suivant.

DÉTAILS DU POSTE:
- Titre: ${title}
- Niveau: ${experienceLevel}
- Description: ${description}

Instructions:
1. Crée 15-20 questions pour évaluer les soft skills
2. Inclus des mises en situation professionnelles
3. Évalue la communication, leadership, travail d'équipe, etc.
4. Fournis un système de scoring
5. Inclus des questions de personnalité adaptées au poste

Format JSON similaire au test technique mais adapté aux soft skills.
`;
    }
  }

  async generateInterviewQuestions(jobDetails, interviewType = 'general') {
    try {
      const prompt = `
Génère une liste de questions d'entretien pour le poste suivant.

DÉTAILS DU POSTE:
- Titre: ${jobDetails.title}
- Compétences: ${jobDetails.skills?.join(', ')}
- Niveau: ${jobDetails.experienceLevel}
- Type d'entretien: ${interviewType}

Instructions:
1. Crée 20-25 questions d'entretien pertinentes
2. Inclus des questions comportementales (méthode STAR)
3. Ajoute des questions techniques adaptées
4. Inclus des questions sur la motivation et fit culturel
5. Fournis des exemples de bonnes réponses
6. Organise par catégories

Format JSON avec catégories de questions.
`;

      const { result, provider } = await AIOrchestrationService.generateWithFallback(
        ['claude', 'openai', 'gemini'],
        prompt,
        { maxTokens: 3000, temperature: 0.7 }
      );

      return {
        content: result,
        type: 'interview',
        interviewType,
        jobDetails,
        aiProvider: provider,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erreur génération questions entretien:', error);
      throw error;
    }
  }
}

module.exports = new TestGenerationService();