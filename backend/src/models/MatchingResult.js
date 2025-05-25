const mongoose = require('mongoose');

const matchingResultSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  skillsMatch: {
    type: Number,
    min: 0,
    max: 100
  },
  experienceMatch: {
    type: Number,
    min: 0,
    max: 100
  },
  locationMatch: {
    type: Number,
    min: 0,
    max: 100
  },
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  summary: String,
  aiProvider: {
    type: String,
    enum: ['claude', 'deepseek', 'gemini', 'openai'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'contacted', 'rejected'],
    default: 'pending'
  },
  recruiterNotes: String
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
matchingResultSchema.index({ jobId: 1, compatibilityScore: -1 });
matchingResultSchema.index({ candidateId: 1, compatibilityScore: -1 });

module.exports = mongoose.model('MatchingResult', matchingResultSchema);