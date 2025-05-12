const { Configuration, OpenAIApi } = require('openai');
const logger = require('../utils/logger');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Generate profile completion suggestions
exports.generateProfileSuggestions = async (profileData, role) => {
  try {
    const prompt = getProfileCompletionPrompt(profileData, role);
    
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert career advisor and HR specialist helping people complete their professional profiles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    logger.error(`AI Profile Suggestions Error: ${error.message}`);
    return {
      suggestions: [],
      error: "Failed to generate suggestions"
    };
  }
};

// Optimize job description
exports.optimizeJobDescription = async (jobTitle, description, style = 'professional') => {
  try {
    const prompt = `I have a job posting for a "${jobTitle}" position. Please optimize and enhance the following job description to make it more attractive to candidates. Use a ${style} tone.
    
    Original description:
    ${description}
    
    Please return an improved version that:
    1. Is more engaging and highlights key benefits
    2. Includes subtle elements that differentiate this position
    3. Has better structure with clear sections
    4. Uses language that appeals to the right candidates
    5. Is around the same length as the original
    `;
    
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert recruiting consultant who specializes in writing compelling job descriptions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    logger.error(`AI Job Optimization Error: ${error.message}`);
    throw new Error('Failed to optimize job description');
  }
};

// Generate interview questions based on job
exports.generateInterviewQuestions = async (job) => {
  try {
    const prompt = `Generate 6 interview questions for a "${job.title}" position. The job requires skills in: ${job.requiredSkills.join(', ')}. Experience required: ${job.experienceRequired || 'Not specified'} years.
    
    Please generate:
    - 2 behavioral questions
    - 2 technical questions related to the role
    - 2 general HR questions
    
    Format as a JSON array of objects with "question" and "type" fields, where type is one of: "behavioral", "technical", "hr".
    `;
    
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert recruiting consultant who creates effective interview questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    logger.error(`AI Interview Questions Error: ${error.message}`);
    return [
      { question: "Tell me about a time you dealt with a difficult customer.", type: "behavioral" },
      { question: "How do you prioritize tasks when under pressure?", type: "behavioral" },
      { question: "What relevant experience do you have for this role?", type: "technical" },
      { question: "What tools or software are you familiar with?", type: "technical" },
      { question: "When would you be available to start?", type: "hr" },
      { question: "What are your salary expectations?", type: "hr" }
    ];
  }
};

// Analyze interview responses
exports.analyzeInterviewResponses = async (questions, responses, jobTitle) => {
  try {
    // Prepare the input data
    const interviewData = questions.map((q, i) => ({
      question: q.question,
      type: q.type,
      response: responses[i] || "No response provided"
    }));
    
    const prompt = `Analyze the following interview responses for a "${jobTitle}" position. For each response, provide a brief assessment of the quality, clarity, and relevance.
    
    Interview responses:
    ${JSON.stringify(interviewData, null, 2)}
    
    Please provide:
    1. An individual assessment for each response (1-3 sentences)
    2. An overall summary of the candidate's strengths and areas for improvement (3-5 sentences)
    3. A numerical score from 1-10 representing how well the candidate performed overall
    
    Format your response as JSON with "individualAssessments", "overallSummary", and "score" fields.
    `;
    
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert HR analyst specializing in evaluating interview responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    logger.error(`AI Interview Analysis Error: ${error.message}`);
    return {
      individualAssessments: interviewData.map(() => "Analysis unavailable"),
      overallSummary: "Unable to generate analysis at this time.",
      score: 5
    };
  }
};

// Helper function to create profile completion prompt
function getProfileCompletionPrompt(profileData, role) {
  if (role === 'candidate') {
    return `Based on the following partial profile for a job candidate, suggest improvements and completions:
    
    ${JSON.stringify(profileData, null, 2)}
    
    Please provide:
    1. Suggested completions for any empty or incomplete fields
    2. Three different versions of a professional summary (formal, casual, and achievement-focused)
    3. Additional skills they might want to add based on their experience
    4. Any other suggestions to improve their profile
    
    Return your response as JSON with fields: "fieldSuggestions", "summaries", "skillSuggestions", and "generalTips".`;
  } else {
    return `Based on the following partial company profile, suggest improvements and completions:
    
    ${JSON.stringify(profileData, null, 2)}
    
    Please provide:
    1. Suggested completions for any empty or incomplete fields
    2. Three different versions of a company description (formal, approachable, and achievement-focused)
    3. Key company values that might be relevant based on the industry
    4. Any other suggestions to improve the company profile
    
    Return your response as JSON with fields: "fieldSuggestions", "descriptions", "valueSuggestions", and "generalTips".`;
  }
}

module.exports = exports;