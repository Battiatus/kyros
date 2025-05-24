/**
 * Configuration des services IA
 * @module config/ai
 */

const config = {
    // AWS Bedrock Configuration
    bedrock: {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      models: {
        claude: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        deepseek: 'deepseek.deepseek-v2.5'
      }
    },
  
    // Vertex AI Configuration
    vertexAI: {
      projectId: process.env.VERTEX_AI_PROJECT_ID,
      location: process.env.VERTEX_AI_LOCATION || 'us-central1',
      keyFilename: process.env.VERTEX_AI_KEY_FILE,
      models: {
        gemini: 'gemini-1.5-pro-002'
      }
    },
  
    // OpenAI Configuration
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      models: {
        gpt4: 'gpt-4-turbo-preview',
        gpt35: 'gpt-3.5-turbo'
      }
    },
  
    // Configuration des coûts et limites
    usage: {
      maxTokensPerRequest: 4000,
      maxRequestsPerDay: 1000,
      costTracking: true
    },
  
    // Configuration des tâches par provider
    taskRouting: {
      jobOptimization: ['bedrock.claude', 'openai.gpt4'],
      cvAnalysis: ['vertexAI.gemini', 'bedrock.claude'],
      matching: ['bedrock.claude', 'vertexAI.gemini'],
      interviewQuestions: ['openai.gpt4', 'bedrock.claude'],
      testGeneration: ['vertexAI.gemini', 'openai.gpt4']
    }
  };
  
  module.exports = config;