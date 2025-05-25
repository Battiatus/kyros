const { VertexAI } = require('@google-cloud/vertexai');
const aiConfig = require('../../config/ai-config');

class VertexAIService {
  constructor() {
    this.vertexAI = new VertexAI({
      project: aiConfig.vertexAI.projectId,
      location: aiConfig.vertexAI.location,
      keyFilename: aiConfig.vertexAI.keyFilename
    });
    
    this.model = this.vertexAI.getGenerativeModel({
      model: aiConfig.vertexAI.model,
    });
  }

  async generateContent(prompt, options = {}) {
    try {
      const generationConfig = {
        maxOutputTokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        topP: options.topP || 0.8,
      };

      const request = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig,
      };

      const response = await this.model.generateContent(request);
      return response.response.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Vertex AI Error:', error);
      throw new Error('Erreur lors de l\'appel à Gemini via Vertex AI');
    }
  }
}

module.exports = new VertexAIService();