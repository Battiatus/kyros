const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['unseen', 'seen', 'favorite', 'accepted', 'rejected', 'interview', 'contract', 'hired'],
    default: 'unseen'
  },
  appliedOn: {
    type: Date,
    default: Date.now
  },
  statusUpdatedOn: Date,
  personalMessage: String,
  recruiterNotes: String,
  rejectionReason: String,
  aiInterviewResults: {
    responses: [Object],
    analysis: Object,
    summary: String,
    score: Number
  },
  matchingScore: {
    type: Number,
    default: 0
  }
});

// Update statusUpdatedOn when status changes
ApplicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusUpdatedOn = Date.now();
  }
  next();
});

module.exports = mongoose.model('Application', ApplicationSchema);