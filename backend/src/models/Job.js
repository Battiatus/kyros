const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
    maxlength: [100, 'Job title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company',
    required: true
  },
  recruiter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  salaryMin: Number,
  salaryMax: Number,
  location: String,
  contractType: {
    type: String,
    enum: ['cdi', 'cdd', 'internship', 'freelance', 'other'],
    required: true
  },
  remote: {
    type: String,
    enum: ['none', 'hybrid', 'full'],
    default: 'none'
  },
  workHours: String,
  requiredSkills: [String],
  requiredLanguages: [String],
  experienceRequired: Number,
  aiInterviewEnabled: {
    type: Boolean,
    default: false
  },
  aiQuestions: [{
    type: String,
    questionType: {
      type: String,
      enum: ['behavioral', 'technical', 'hr']
    }
  }],
  urgent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'filled'],
    default: 'active'
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },
  expirationDate: Date,
  desiredStartDate: Date,
  viewCount: {
    type: Number,
    default: 0
  },
  applicationCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
});

// Create job slug from the title
JobSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  // Set expiration date to 30 days from now if not provided
  if (!this.expirationDate) {
    this.expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Increment application count
JobSchema.methods.incrementApplicationCount = function() {
  this.applicationCount += 1;
  return this.save();
};

// Increment view count
JobSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Job', JobSchema);