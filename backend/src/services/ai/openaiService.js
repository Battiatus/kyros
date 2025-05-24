/**
 * Service OpenAI pour IA
 * @module services/ai/openaiService
 */

const OpenAI = require('openai');
const aiConfig = require('../../config/ai');
const logger = require('../../utils/logger');

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: aiConfig.openai.apiKey
    });
  }

  /**
   * Exécute une tâche avec OpenAI
   * @param {string} model - Nom du modèle
   * @param {Object} payload - Données d'entrée
   * @param {Object} options - Options
   * @returns {Promise<Object>} Résultat de l'IA
   */
  async execute(model, payload, options = {}) {
    try {
      const modelName = aiConfig.openai.models[model];
      if (!modelName) {
        throw new Error(`Modèle OpenAI non configuré: ${model}`);
      }

      const completion = await this.client.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: 'user',
            content: payload.prompt
          }
        ],
        max_tokens: options.maxTokens || aiConfig.usage.maxTokensPerRequest,
        temperature: options.temperature || 0.7,
        response_format: { type: "json_object" }
      });

      return this.parseResponse(completion);
    } catch (error) {
      logger.error(`Erreur OpenAI ${model}:`, error);
      throw new Error(`Échec de l'exécution OpenAI: ${error.message}`);
    }
  }

  parseResponse(completion) {
    try {
      const content = completion.choices[0].message.content;
      const usage = {
        tokens: completion.usage.total_tokens,
        cost: this.calculateOpenAICost(completion.usage, completion.model)
      };

      // Parser le JSON
      let data;
      try {
        data = JSON.parse(content);
      } catch {
        data = { response: content };
      }

      return { data, usage };
    } catch (error) {
      logger.error('Erreur parsing réponse OpenAI:', error);
      throw new Error('Impossible de parser la réponse OpenAI');
    }
  }

  calculateOpenAICost(usage, model) {
    // Tarifs approximatifs OpenAI
    let inputRate, outputRate;
    
    if (model.includes('gpt-4')) {
      inputRate = 0.01;   // $0.01 per 1K tokens
      outputRate = 0.03;  // $0.03 per 1K tokens
    } else {
      inputRate = 0.0015; // $0.0015 per 1K tokens
      outputRate = 0.002; // $0.002 per 1K tokens
    }

    const inputCost = (usage.prompt_tokens / 1000) * inputRate;
    const outputCost = (usage.completion_tokens / 1000) * outputRate;
    return inputCost + outputCost;
  }

  async isAvailable() {
    try {
      // Test simple pour vérifier la disponibilité
      await this.client.chat.completions.create({
        model: aiConfig.openai.models.gpt35,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      });
      
      return true;
    } catch (error) {
      logger.warn('OpenAI indisponible:', error.message);
      return false;
    }
  }
}

module.exports = new OpenAIService();