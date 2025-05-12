const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  logo: String,
  emailDomain: String,
  address: String,
  sector: String,
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501+']
  },
  languages: [String],
  website: String,
  socialLinks: {
    linkedin: String,
    instagram: String,
    facebook: String,
    twitter: String
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  videoPresentationUrl: String,
  avatarGenerated: Object,
  values: [String],
  workAtmosphere: String,
  benefits: [String],
  premiumPlan: {
    type: String,
    enum: ['none', 'basic', 'pro', 'enterprise'],
    default: 'none'
  },
  planExpiration: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  completionPercentage: {
    type: Number,
    default: 0
  },
  adminUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

// Calculate company profile completion percentage
CompanySchema.methods.calculateCompletionPercentage = function() {
  let fields = 0;
  let completedFields = 0;
  
  // Required fields
  const requiredFields = [
    'name', 'sector', 'size', 'address', 'description'
  ];
  
  fields += requiredFields.length;
  
  requiredFields.forEach(field => {
    if (this[field]) completedFields++;
  });
  
  // Optional fields with different weights
  if (this.logo) completedFields++;
  fields++;
  
  if (this.videoPresentationUrl || this.avatarGenerated) completedFields++;
  fields++;
  
  if (this.website) completedFields++;
  fields++;
  
  if (this.socialLinks && Object.values(this.socialLinks).some(link => link)) {
    completedFields++;
  }
  fields++;
  
  if (this.values && this.values.length > 0) completedFields++;
  fields++;
  
  // Calculate percentage
  this.completionPercentage = Math.round((completedFields / fields) * 100);
  return this.completionPercentage;
};

module.exports = mongoose.model('Company', CompanySchema);