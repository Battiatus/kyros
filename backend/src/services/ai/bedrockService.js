/**
 * Service AWS Bedrock pour IA
 * @module services/ai/bedrockService
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const aiConfig = require('../../config/ai');
const logger = require('../../utils/logger');

class BedrockService {
  constructor() {
    this.client = new BedrockRuntimeClient({
      region: aiConfig.bedrock.region,
      credentials: {
        accessKeyId: aiConfig.bedrock.accessKeyId,
        secretAccessKey: aiConfig.bedrock.secretAccessKey
      }
    });
  }

  /**
   * Exécute une tâche avec un modèle Bedrock
   * @param {string} model - Nom du modèle
   * @param {Object} payload - Données d'entrée
   * @param {Object} options - Options
   * @returns {Promise<Object>} Résultat de l'IA
   */
  async execute(model, payload, options = {}) {
    try {
      const modelId = aiConfig.bedrock.models[model];
      if (!modelId) {
        throw new Error(`Modèle Bedrock non configuré: ${model}`);
      }

      let requestBody;
      if (model === 'claude') {
        requestBody = this.buildClaudeRequest(payload, options);
      } else if (model === 'deepseek') {
        requestBody = this.buildDeepSeekRequest(payload, options);
      }

      const command = new InvokeModelCommand({
        modelId,
        body: JSON.stringify(requestBody),
        contentType: 'application/json',
        accept: 'application/json'
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      return this.parseResponse(model, responseBody);
    } catch (error) {
      logger.error(`Erreur Bedrock ${model}:`, error);
      throw new Error(`Échec de l'exécution Bedrock: ${error.message}`);
    }
  }

  buildClaudeRequest(payload, options) {
    return {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: options.maxTokens || aiConfig.usage.maxTokensPerRequest,
      temperature: options.temperature || 0.7,
      messages: [
        {
          role: "user",
          content: payload.prompt
        }
      ]
    };
  }

  buildDeepSeekRequest(payload, options) {
    return {
      messages: [
        {
          role: "user",
          content: payload.prompt
        }
      ],
      max_tokens: options.maxTokens || aiConfig.usage.maxTokensPerRequest,
      temperature: options.temperature || 0.7,
      stream: false
    };
  }

  parseResponse(model, responseBody) {
    try {
      let content;
      let usage = {};

      if (model === 'claude') {
        content = responseBody.content[0].text;
        usage = {
          tokens: responseBody.usage.input_tokens + responseBody.usage.output_tokens,
          cost: this.calculateClaudeCost(responseBody.usage)
        };
      } else if (model === 'deepseek') {
        content = responseBody.choices[0].message.content;
        usage = {
          tokens: responseBody.usage.total_tokens,
          cost: this.calculateDeepSeekCost(responseBody.usage)
        };
      }

      // Parser le JSON si c'est une réponse structurée
      let data;
      try {
        data = JSON.parse(content);
      } catch {
        data = { response: content };
      }

      return { data, usage };
    } catch (error) {
      logger.error('Erreur parsing réponse Bedrock:', error);
      throw new Error('Impossible de parser la réponse Bedrock');
    }
  }

  calculateClaudeCost(usage) {
    // Tarifs approximatifs AWS Bedrock Claude 3.5 Sonnet
    const inputCost = (usage.input_tokens / 1000) * 0.003;
    const outputCost = (usage.output_tokens / 1000) * 0.015;
    return inputCost + outputCost;
  }

  calculateDeepSeekCost(usage) {
    // Tarifs approximatifs DeepSeek
    return (usage.total_tokens / 1000) * 0.0014;
  }

  async isAvailable() {
    try {
      // Test simple pour vérifier la disponibilité
      const testCommand = new InvokeModelCommand({
        modelId: aiConfig.bedrock.models.claude,
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 10,
          messages: [{ role: "user", content: "test" }]
        }),
        contentType: 'application/json'
      });
      
      await this.client.send(testCommand);
      return true;
    } catch (error) {
      logger.warn('Bedrock indisponible:', error.message);
      return false;
    }
  }
}

module.exports = new BedrockService();