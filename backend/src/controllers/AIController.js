const MatchingService = require('../services/matchingService');
const CVGenerationService = require('../services/CVGenerationService');
const JobOfferGenerationService = require('../services/JobOfferGenerationService');
const TestGenerationService = require('../services/TestGenerationService');
const MatchingResult = require('../models/MatchingResult');
const GeneratedContent = require('../models/GeneratedContent');

class AIController {
  // Matching
  async matchCandidateToJob(req, res) {
    try {
      const { jobId } = req.params;
      const candidateId = req.user.id;

      const matchingResult = await MatchingService.calculateJobCandidateMatch(jobId, candidateId);
      
      // Sauvegarder le résultat
      const savedResult = await MatchingResult.create(matchingResult);

      res.json({
        success: true,
        data: savedResult,
        message: 'Analyse de compatibilité terminée'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async findBestMatches(req, res) {
    try {
      const { jobId } = req.params;
      const { limit = 10 } = req.query;

      const matches = await MatchingService.findBestMatches(jobId, parseInt(limit));

      res.json({
        success: true,
        data: matches,
        message: `${matches.length} candidats trouvés`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Génération CV
  async generateCV(req, res) {
    try {
      const userId = req.user.id;
      const options = req.body;

      const cvResult = await CVGenerationService.generateCV(userId, options);
      
      // Sauvegarder le CV généré
      const savedContent = await GeneratedContent.create({
        userId,
        type: 'cv',
        content: cvResult.content,
        aiProvider: cvResult.aiProvider,
        options
      });

      res.json({
        success: true,
        data: savedContent,
        message: 'CV généré avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async improveCVSection(req, res) {
    try {
      const userId = req.user.id;
      const { section, content } = req.body;

      const improvedContent = await CVGenerationService.improveCVSection(userId, section, content);

      res.json({
        success: true,
        data: { improvedContent },
        message: 'Section améliorée avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Génération offre d'emploi
  async generateJobOffer(req, res) {
    try {
      const recruiterId = req.user.id;
      const jobDetails = req.body;

      const offerResult = await JobOfferGenerationService.generateJobOffer(recruiterId, jobDetails);
      
      // Sauvegarder l'offre générée
      const savedContent = await GeneratedContent.create({
        userId: recruiterId,
        type: 'job_offer',
        content: offerResult.content,
        aiProvider: offerResult.aiProvider,
        options: jobDetails
      });

      res.json({
        success: true,
        data: savedContent,
        message: 'Offre d\'emploi générée avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async optimizeJobOfferSEO(req, res) {
    try {
      const { content, keywords } = req.body;

      const optimizedContent = await JobOfferGenerationService.optimizeJobOfferForSEO(content, keywords);

      res.json({
        success: true,
        data: { optimizedContent },
        message: 'Offre optimisée pour le SEO'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Génération de tests
  async generateTechnicalTest(req, res) {
    try {
      const { jobDetails, difficulty = 'intermediate' } = req.body;

      const testResult = await TestGenerationService.generateTechnicalTest(jobDetails, difficulty);
      
      // Sauvegarder le test
      const savedContent = await GeneratedContent.create({
        userId: req.user.id,
        type: 'test',
        content: testResult.content,
        aiProvider: testResult.aiProvider,
        options: { type: 'technical', difficulty, jobDetails }
      });

      res.json({
        success: true,
        data: savedContent,
        message: 'Test technique généré avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async generateSoftSkillsTest(req, res) {
    try {
      const { jobDetails } = req.body;

      const testResult = await TestGenerationService.generateSoftSkillsTest(jobDetails);
      
      // Sauvegarder le test
      const savedContent = await GeneratedContent.create({
        userId: req.user.id,
        type: 'test',
        content: testResult.content,
        aiProvider: testResult.aiProvider,
        options: { type: 'softskills', jobDetails }
      });

      res.json({
        success: true,
        data: savedContent,
        message: 'Test soft skills généré avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async generateInterviewQuestions(req, res) {
    try {
      const { jobDetails, interviewType = 'general' } = req.body;

      const questionsResult = await TestGenerationService.generateInterviewQuestions(jobDetails, interviewType);
      
      // Sauvegarder les questions
      const savedContent = await GeneratedContent.create({
        userId: req.user.id,
        type: 'interview_questions',
        content: questionsResult.content,
        aiProvider: questionsResult.aiProvider,
        options: { interviewType, jobDetails }
      });

      res.json({
        success: true,
        data: savedContent,
        message: 'Questions d\'entretien générées avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Historique et gestion
  async getGeneratedContent(req, res) {
    try {
      const userId = req.user.id;
      const { type, page = 1, limit = 10 } = req.query;

      const filter = { userId, 'metadata.isActive': true };
      if (type) filter.type = type;

      const content = await GeneratedContent.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await GeneratedContent.countDocuments(filter);

      res.json({
        success: true,
        data: {
          content,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMatchingHistory(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const filter = req.user.role === 'candidate' 
        ? { candidateId: userId }
        : { jobId: { $in: await this.getUserJobIds(userId) } };

      const results = await MatchingResult.find(filter)
        .populate('jobId', 'title company')
        .populate('candidateId', 'firstName lastName profile')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await MatchingResult.countDocuments(filter);

      res.json({
        success: true,
        data: {
          results,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUserJobIds(userId) {
    const Job = require('../models/Job');
    const jobs = await Job.find({ recruiter: userId }).select('_id');
    return jobs.map(job => job._id);
  }
}

module.exports = new AIController();