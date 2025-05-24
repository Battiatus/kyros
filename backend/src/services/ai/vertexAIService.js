/**
 * Service Vertex AI pour IA
 * @module services/ai/vertexAIService
 */

const { VertexAI } = require('@google-cloud/vertexai');
const aiConfig = require('../../config/ai');
const logger = require('../../utils/logger');

class VertexAIService {
  constructor() {
    this.vertexAI = new VertexAI({
      project: aiConfig.vertexAI.projectId,
      location: aiConfig.vertexAI.location,
      keyFilename: aiConfig.vertexAI.keyFilename
    });
  }

  /**
   * Exécute une tâche avec Vertex AI
   * @param {string} model - Nom du modèle
   * @param {Object} payload - Données d'entrée
   * @param {Object} options - Options
   * @returns {Promise<Object>} Résultat de l'IA
   */
  async execute(model, payload, options = {}) {
    try {
      const modelName = aiConfig.vertexAI.models[model];
      if (!modelName) {
        throw new Error(`Modèle Vertex AI non configuré: ${model}`);
      }

      const generativeModel = this.vertexAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: options.maxTokens || aiConfig.usage.maxTokensPerRequest,
          temperature: options.temperature || 0.7,
          topP: 0.8,
          topK: 40
        }
      });

      const request = {
        contents: [
          {
            role: 'user',
            parts: [{ text: payload.prompt }]
          }
        ]
      };

      const result = await generativeModel.generateContent(request);
      const response = await result.response;

      return this.parseResponse(response);
    } catch (error) {
      logger.error(`Erreur Vertex AI ${model}:`, error);
      throw new Error(`Échec de l'exécution Vertex AI: ${error.message}`);
    }
  }

  parseResponse(response) {
    try {
      const content = response.candidates[0].content.parts[0].text;
      const usage = {
        tokens: response.usageMetadata?.totalTokenCount || 0,
        cost: this.calculateVertexCost(response.usageMetadata)
      };

      // Parser le JSON si c'est une réponse structurée
      let data;
      try {
        data = JSON.parse(content);
      } catch {
        data = { response: content };
      }

      return { data, usage };
    } catch (error) {
      logger.error('Erreur parsing réponse Vertex AI:', error);
      throw new Error('Impossible de parser la réponse Vertex AI');
    }
  }

  calculateVertexCost(usageMetadata) {
    if (!usageMetadata) return 0;
    
    // Tarifs approximatifs Vertex AI Gemini
    const inputCost = (usageMetadata.promptTokenCount / 1000) * 0.00125;
    const outputCost = (usageMetadata.candidatesTokenCount / 1000) * 0.00375;
    return inputCost + outputCost;
  }

  async isAvailable() {
    try {
      // Test simple pour vérifier la disponibilité
      const generativeModel = this.vertexAI.getGenerativeModel({
        model: aiConfig.vertexAI.models.gemini
      });

      await generativeModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: 'test' }] }]
      });
      
      return true;
    } catch (error) {
      logger.warn('Vertex AI indisponible:', error.message);
      return false;
    }
  }
}

module.exports = new VertexAIService();