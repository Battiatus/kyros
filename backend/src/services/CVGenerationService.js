const AIOrchestrationService = require('./ai/AIOrchestrationService');
const User = require('../models/User');

class CVGenerationService {
  async generateCV(userId, options = {}) {
    try {
      const user = await User.findById(userId).populate('profile');
      if (!user) {
        throw new Error('Utilisateur introuvable');
      }

      const prompt = this.buildCVPrompt(user, options);
      
      const { result, provider } = await AIOrchestrationService.generateWithFallback(
        ['claude', 'openai', 'gemini'],
        prompt,
        { maxTokens: 3000, temperature: 0.7 }
      );

      return {
        content: result,
        userId,
        aiProvider: provider,
        options,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erreur génération CV:', error);
      throw error;
    }
  }

  buildCVPrompt(user, options) {
    const { style = 'professionnel', targetRole, language = 'français' } = options;

    return `
Génère un CV ${style} en ${language} pour ce candidat.

INFORMATIONS CANDIDAT:
- Nom: ${user.firstName} ${user.lastName}
- Email: ${user.email}
- Téléphone: ${user.profile?.phone || 'Non spécifié'}
- Titre professionnel: ${user.profile?.title || 'Non spécifié'}
- Localisation: ${user.profile?.location || 'Non spécifiée'}
- Résumé professionnel: ${user.profile?.summary || 'Non spécifié'}

EXPÉRIENCE PROFESSIONNELLE:
${user.profile?.workExperience?.map(exp => `
- ${exp.title} chez ${exp.company} (${exp.startDate} - ${exp.endDate})
  Description: ${exp.description}
`).join('\n') || 'Aucune expérience renseignée'}

FORMATION:
${user.profile?.education || 'Formation non spécifiée'}

COMPÉTENCES:
${user.profile?.skills?.join(', ') || 'Compétences non spécifiées'}

LANGUES:
${user.profile?.languages?.join(', ') || 'Langues non spécifiées'}

${targetRole ? `POSTE CIBLÉ: ${targetRole}` : ''}

Instructions:
1. Structure le CV de manière professionnelle et moderne
2. Mets en valeur les points forts du candidat
3. Adapte le contenu au style demandé (${style})
4. ${targetRole ? `Optimise pour le poste de ${targetRole}` : 'Garde un format généraliste'}
5. Utilise un formatage Markdown lisible
6. Ajoute des conseils d'amélioration à la fin

Format: Markdown avec sections claires
`;
  }

  async improveCVSection(userId, section, content) {
    try {
      const prompt = `
Améliore cette section "${section}" d'un CV :

CONTENU ACTUEL:
${content}

Instructions:
1. Rends le contenu plus impactant et professionnel
2. Utilise des mots-clés pertinents pour le domaine
3. Structure l'information de manière claire
4. Ajoute des éléments quantifiables si possible
5. Garde un ton professionnel mais engageant

Fournis uniquement le contenu amélioré en format Markdown.
`;

      const { result } = await AIOrchestrationService.generateWithFallback(
        ['claude', 'openai', 'gemini'],
        prompt,
        { maxTokens: 1000, temperature: 0.6 }
      );

      return result;
    } catch (error) {
      console.error('Erreur amélioration section CV:', error);
      throw error;
    }
  }
}

module.exports = new CVGenerationService();