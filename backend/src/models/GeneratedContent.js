const mongoose = require('mongoose');

const generatedContentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['cv', 'job_offer', 'test', 'interview_questions'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  aiProvider: {
    type: String,
    enum: ['claude', 'deepseek', 'gemini', 'openai'],
    required: true
  },
  options: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  metadata: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    version: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

generatedContentSchema.index({ userId: 1, type: 1, 'metadata.isActive': 1 });

module.exports = mongoose.model('GeneratedContent', generatedContentSchema);