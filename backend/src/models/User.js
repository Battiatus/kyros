const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add a first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: String,
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter', 'company_admin', 'platform_admin'],
    default: 'candidate'
  },
  company: {
    type: mongoose.Schema.ObjectId,
    ref: 'Company'
  },
  profilePicture: String,
  videoPresentationUrl: String,
  avatarGenerated: Object,
  resumeText: String,
  dateOfBirth: Date,
  nationality: String,
  address: String,
  availability: [Object],
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiration: Date,
  boostActive: {
    type: Boolean,
    default: false
  },
  boostExpiration: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  completionPercentage: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate profile completion percentage
UserSchema.methods.calculateCompletionPercentage = function() {
  let fields = 0;
  let completedFields = 0;
  
  // Required fields
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone', 'profilePicture', 
    'resumeText', 'nationality', 'address'
  ];
  
  fields += requiredFields.length;
  
  requiredFields.forEach(field => {
    if (this[field]) completedFields++;
  });
  
  // Optional fields with different weights
  if (this.videoPresentationUrl || this.avatarGenerated) completedFields++;
  fields++;
  
  if (this.availability && this.availability.length > 0) completedFields++;
  fields++;
  
  // Calculate percentage
  this.completionPercentage = Math.round((completedFields / fields) * 100);
  return this.completionPercentage;
};

module.exports = mongoose.model('User', UserSchema);