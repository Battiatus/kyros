const OpenAI = require('openai');
const aiConfig = require('../../config/ai-config');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: aiConfig.openai.apiKey,
      organization: aiConfig.openai.organization
    });
  }

  async generateCompletion(prompt, options = {}) {
    try {
      const response = await this.openai.chat.completions.create({
        model: options.model || aiConfig.openai.model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Error:', error);
      throw new Error('Erreur lors de l\'appel à OpenAI');
    }
  }
}

module.exports = new OpenAIService();