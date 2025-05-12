const logger = require('../utils/logger');

// Calculate match score between candidate and job
exports.calculateMatchScore = async (candidate, job, experiences = [], skills = [], isRecruiterSearching = false) => {
  try {
    let score = 0;
    const maxScore = 100;
    
    // Initialize scoring weights
    const weights = {
      skills: 35,
      experience: 25,
      languages: 15,
      location: 15,
      availability: 10
    };
    
    // 1. Skills matching (35%)
    const skillScore = calculateSkillScore(candidate, job, skills);
    
    // 2. Experience matching (25%)
    const experienceScore = calculateExperienceScore(candidate, job, experiences);
    
    // 3. Languages matching (15%)
    const languageScore = calculateLanguageScore(candidate, job);
    
    // 4. Location matching (15%)
    const locationScore = calculateLocationScore(candidate, job);
    
    // 5. Availability matching (10%)
    const availabilityScore = calculateAvailabilityScore(candidate, job);
    
    // Calculate weighted total score
    score = (
      (skillScore * weights.skills) +
      (experienceScore * weights.experience) +
      (languageScore * weights.languages) +
      (locationScore * weights.location) +
      (availabilityScore * weights.availability)
    ) / 100;
    
    // Normalize score to 0-100
    const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);
    
    // Apply premium boost if applicable and if recruiter is searching for candidates
    if (isRecruiterSearching && candidate.isPremium) {
      // Give a small boost to premium users (max 5%)
      const premiumBoost = Math.min(5, 100 - normalizedScore);
      return normalizedScore + premiumBoost;
    }
    
    return normalizedScore;
  } catch (error) {
    logger.error(`Match Score Calculation Error: ${error.message}`);
    return 50; // Default score on error
  }
};

// Helper functions for score calculations
function calculateSkillScore(candidate, job, skills) {
  if (!job.requiredSkills || job.requiredSkills.length === 0) {
    return 100; // No skills required, perfect match
  }
  
  // Extract candidate skills from the skills array
  const candidateSkills = skills.map(s => s.name.toLowerCase());
  
  // Count matching skills
  const requiredSkills = job.requiredSkills.map(s => s.toLowerCase());
  const matchingSkills = candidateSkills.filter(skill => 
    requiredSkills.some(reqSkill => reqSkill.includes(skill) || skill.includes(reqSkill))
  );
  
  // Calculate skill match percentage
  return Math.min(100, Math.round((matchingSkills.length / requiredSkills.length) * 100));
}

function calculateExperienceScore(candidate, job, experiences) {
  // If no experience required, perfect match
  if (!job.experienceRequired) {
    return 100;
  }
  
  // Calculate total relevant experience
  let totalRelevantExperience = 0;
  
  experiences.forEach(exp => {
    // Check if experience is relevant to the job
    const isRelevant = exp.title.toLowerCase().includes(job.title.toLowerCase()) || 
                      job.title.toLowerCase().includes(exp.title.toLowerCase());
    
    if (isRelevant) {
      // Calculate duration in years
      const startDate = new Date(exp.startDate);
      const endDate = exp.endDate ? new Date(exp.endDate) : new Date();
      const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
      
      totalRelevantExperience += years;
    }
  });
  
  // Calculate experience match percentage
  if (totalRelevantExperience >= job.experienceRequired) {
    return 100; // Meets or exceeds requirement
  } else {
    return Math.round((totalRelevantExperience / job.experienceRequired) * 100);
  }
}

function calculateLanguageScore(candidate, job) {
  if (!job.requiredLanguages || job.requiredLanguages.length === 0) {
    return 100; // No languages required, perfect match
  }
  
  // Extract candidate languages
  const candidateLanguages = candidate.languages || [];
  
  // Count matching languages
  const matchingLanguages = candidateLanguages.filter(lang => 
    job.requiredLanguages.includes(lang)
  );
  
  // Calculate language match percentage
  return Math.min(100, Math.round((matchingLanguages.length / job.requiredLanguages.length) * 100));
}

function calculateLocationScore(candidate, job) {
  // If job is remote, perfect location match
  if (job.remote === 'full') {
    return 100;
  }
  
  // If location data is missing, give a middle score
  if (!candidate.address || !job.location) {
    return 50;
  }
  
  // Simple exact match for now (could be enhanced with geocoding and distance calculation)
  const candidateLocation = candidate.address.toLowerCase();
  const jobLocation = job.location.toLowerCase();
  
  if (candidateLocation.includes(jobLocation) || jobLocation.includes(candidateLocation)) {
    return 100;
  }
  
  // Check for city or region match
  const locationParts = jobLocation.split(',').map(part => part.trim());
  const candidateParts = candidateLocation.split(',').map(part => part.trim());
  
  for (const part of candidateParts) {
    if (locationParts.some(loc => loc.includes(part) || part.includes(loc))) {
      return 75; // Partial match (same city/region)
    }
  }
  
  // If job allows hybrid, give a middle score for non-matching location
  if (job.remote === 'hybrid') {
    return 50;
  }
  
  // Low score for location mismatch
  return 25;
}

function calculateAvailabilityScore(candidate, job) {
  // If no desired start date for job, perfect match
  if (!job.desiredStartDate) {
    return 100;
  }
  
  // If candidate doesn't have availability data, give a middle score
  if (!candidate.availability || candidate.availability.length === 0) {
    return 50;
  }
  
  // Check if candidate is available on or before desired start date
  const jobStartDate = new Date(job.desiredStartDate);
  const now = new Date();
  
  // If candidate is immediately available
  if (candidate.availability.some(avail => avail.status === 'immediate')) {
    return 100;
  }
  
  // Find the earliest available date
  const availableDates = candidate.availability
    .filter(avail => avail.startDate)
    .map(avail => new Date(avail.startDate));
  
  if (availableDates.length === 0) {
    return 50; // No specific dates, middle score
  }
  
  const earliestAvailable = new Date(Math.min(...availableDates));
  
  // If available before job start date
  if (earliestAvailable <= jobStartDate) {
    return 100;
  }
  
  // Calculate days difference
  const daysDifference = (earliestAvailable - jobStartDate) / (1000 * 60 * 60 * 24);
  
  // Score based on how close candidate availability is to job start date
  if (daysDifference <= 7) {
    return 90; // Available within a week after desired date
  } else if (daysDifference <= 14) {
    return 80; // Available within two weeks
  } else if (daysDifference <= 30) {
    return 60; // Available within a month
  } else {
    return 30; // Available after a month
  }
}

module.exports = exports;