const AIOrchestrationService = require('./ai/AIOrchestrationService');
const User = require('../models/User');

class JobOfferGenerationService {
  async generateJobOffer(recruiterId, jobDetails) {
    try {
      const recruiter = await User.findById(recruiterId).populate('company');
      if (!recruiter) {
        throw new Error('Recruteur introuvable');
      }

      const prompt = this.buildJobOfferPrompt(recruiter, jobDetails);
      
      const { result, provider } = await AIOrchestrationService.generateWithFallback(
        ['claude', 'openai', 'gemini'],
        prompt,
        { maxTokens: 3000, temperature: 0.7 }
      );

      return {
        content: result,
        recruiterId,
        aiProvider: provider,
        jobDetails,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erreur génération offre emploi:', error);
      throw error;
    }
  }

  buildJobOfferPrompt(recruiter, jobDetails) {
    const {
      title,
      department,
      experienceLevel,
      contractType,
      location,
      salary,
      skills,
      description,
      benefits,
      companyDescription
    } = jobDetails;

    return `
Génère une offre d'emploi attractive et professionnelle.

INFORMATIONS ENTREPRISE:
- Nom: ${recruiter.company?.name || 'Non spécifié'}
- Secteur: ${recruiter.company?.industry || 'Non spécifié'}
- Taille: ${recruiter.company?.size || 'Non spécifiée'}
- Description: ${companyDescription || recruiter.company?.description || 'Non spécifiée'}

DÉTAILS DU POSTE:
- Titre: ${title}
- Département: ${department || 'Non spécifié'}
- Niveau d'expérience: ${experienceLevel}
- Type de contrat: ${contractType}
- Localisation: ${location}
- Salaire: ${salary || 'À négocier'}
- Compétences requises: ${skills?.join(', ') || 'Non spécifiées'}
- Description basique: ${description || 'Non spécifiée'}
- Avantages: ${benefits?.join(', ') || 'Non spécifiés'}

Instructions:
1. Crée une offre d'emploi attractive et moderne
2. Structure l'offre avec des sections claires
3. Utilise un ton professionnel mais engageant
4. Mets en valeur l'entreprise et le poste
5. Inclus un appel à l'action efficace
6. Optimise pour attirer les bons candidats

Format: Markdown avec sections bien définies (Présentation entreprise, Description poste, Profil recherché, etc.)
`;
  }

  async optimizeJobOfferForSEO(content, keywords) {
    try {
      const prompt = `
Optimise cette offre d'emploi pour le SEO et l'attractivité en ligne.

OFFRE ACTUELLE:
${content}

MOTS-CLÉS À INTÉGRER:
${keywords?.join(', ') || 'Aucun mot-clé spécifique'}

Instructions:
1. Intègre naturellement les mots-clés
2. Améliore le titre pour le SEO
3. Structure le contenu pour une meilleure lisibilité
4. Ajoute des éléments attractifs pour les candidats
5. Optimise pour les moteurs de recherche d'emploi

Fournis uniquement l'offre optimisée en format Markdown.
`;

      const { result } = await AIOrchestrationService.generateWithFallback(
        ['claude', 'openai', 'gemini'],
        prompt,
        { maxTokens: 2000, temperature: 0.6 }
      );

      return result;
    } catch (error) {
      console.error('Erreur optimisation SEO offre:', error);
      throw error;
    }
  }
}

module.exports = new JobOfferGenerationService();