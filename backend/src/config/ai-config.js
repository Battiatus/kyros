module.exports = {
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      models: {
        claude: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
        deepseek: 'deepseek-ai.deepseek-v3'
      }
    },
    vertexAI: {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      model: 'gemini-1.5-pro'
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: 'gpt-4o',
      organization: process.env.OPENAI_ORGANIZATION
    }
  };