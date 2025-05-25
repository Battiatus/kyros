const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");
const aiConfig = require('../../config/ai-config');

class AWSBedrockService {
  constructor() {
    this.client = new BedrockRuntimeClient({
      region: aiConfig.aws.region,
      credentials: {
        accessKeyId: aiConfig.aws.accessKeyId,
        secretAccessKey: aiConfig.aws.secretAccessKey,
      },
    });
  }

  async invokeClaude(prompt, maxTokens = 4000) {
    try {
      const body = JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      const command = new InvokeModelCommand({
        modelId: aiConfig.aws.models.claude,
        body: body,
        contentType: "application/json",
        accept: "application/json",
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return responseBody.content[0].text;
    } catch (error) {
      console.error('AWS Bedrock Claude Error:', error);
      throw new Error('Erreur lors de l\'appel à Claude via AWS Bedrock');
    }
  }

  async invokeDeepSeek(prompt, maxTokens = 4000) {
    try {
      const body = JSON.stringify({
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      });

      const command = new InvokeModelCommand({
        modelId: aiConfig.aws.models.deepseek,
        body: body,
        contentType: "application/json",
        accept: "application/json",
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      return responseBody.choices[0].message.content;
    } catch (error) {
      console.error('AWS Bedrock DeepSeek Error:', error);
      throw new Error('Erreur lors de l\'appel à DeepSeek via AWS Bedrock');
    }
  }
}

module.exports = new AWSBedrockService();