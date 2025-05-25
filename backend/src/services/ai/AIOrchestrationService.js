const AWSBedrockService = require('./AWSBedrockService');
const VertexAIService = require('./vertexAIService');
const OpenAIService = require('./openaiService');

class AIOrchestrationService {
  constructor() {
    this.providers = {
      claude: (prompt, options) => AWSBedrockService.invokeClaude(prompt, options?.maxTokens),
      deepseek: (prompt, options) => AWSBedrockService.invokeDeepSeek(prompt, options?.maxTokens),
      gemini: (prompt, options) => VertexAIService.generateContent(prompt, options),
      openai: (prompt, options) => OpenAIService.generateCompletion(prompt, options)
    };
  }

  async generateWithProvider(provider, prompt, options = {}) {
    if (!this.providers[provider]) {
      throw new Error(`Provider ${provider} non supporté`);
    }

    try {
      return await this.providers[provider](prompt, options);
    } catch (error) {
      console.error(`Erreur avec le provider ${provider}:`, error);
      throw error;
    }
  }

  async generateWithFallback(providers, prompt, options = {}) {
    for (const provider of providers) {
      try {
        const result = await this.generateWithProvider(provider, prompt, options);
        return { result, provider, success: true };
      } catch (error) {
        console.warn(`Provider ${provider} failed, trying next...`, error.message);
        continue;
      }
    }
    
    throw new Error('Tous les providers IA ont échoué');
  }
}

module.exports = new AIOrchestrationService();