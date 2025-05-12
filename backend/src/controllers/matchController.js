const User = require('../models/User');
const Job = require('../models/Job');
const Experience = require('../models/Experience');
const Skill = require('../models/Skill');
const Application = require('../models/Application');
const SwipeHistory = require('../models/SwipeHistory');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const { calculateMatchScore } = require('../services/matchingService');

// @desc    Get matched jobs for candidate
// @route   GET /api/matches/jobs
// @access  Private (Candidate)
exports.getMatchedJobs = asyncHandler(async (req, res, next) => {
  // Ensure user is a candidate
  if (req.user.role !== 'candidate') {
    return next(
      new ErrorResponse('Only candidates can view matched jobs', 403)
    );
  }

  // Get candidate's skills and experience data
  const user = await User.findById(req.user.id);
  const experiences = await Experience.find({ user: req.user.id });
  const skills = await Skill.find({ user: req.user.id });
  
  // Find existing applications to exclude
  const appliedJobs = await Application.find({ candidate: req.user.id })
    .select('job')
    .lean();
  const appliedJobIds = appliedJobs.map(app => app.job.toString());

  // Find jobs that have been swiped left to exclude
  const swipedLeftJobs = await SwipeHistory.find({
    user: req.user.id,
    action: 'left'
  })
    .select('job')
    .lean();
  const swipedLeftJobIds = swipedLeftJobs.map(swipe => swipe.job.toString());

  // Exclude already applied jobs and swiped left jobs
  const excludeJobIds = [...appliedJobIds, ...swipedLeftJobIds];

  // Get active jobs
  let jobs = await Job.find({
    status: 'active',
    _id: { $nin: excludeJobIds },
    expirationDate: { $gt: Date.now() }
  })
    .populate('company', 'name logo')
    .limit(50)
    .lean();

  // Calculate match score for each job
  const matchedJobs = await Promise.all(
    jobs.map(async job => {
      const matchScore = await calculateMatchScore(user, job, experiences, skills);
      return {
        ...job,
        matchScore
      };
    })
  );

  // Sort by match score descending
  matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

  res.status(200).json({
    success: true,
    count: matchedJobs.length,
    data: matchedJobs
  });
});

// @desc    Get matched candidates for job
// @route   GET /api/matches/candidates/:jobId
// @access  Private (Recruiter/Company Admin)
exports.getMatchedCandidates = asyncHandler(async (req, res, next) => {
  // Ensure user is a recruiter or company admin
  if (req.user.role !== 'recruiter' && req.user.role !== 'company_admin') {
    return next(
      new ErrorResponse('Only recruiters can view matched candidates', 403)
    );
  }

  // Get job
  const job = await Job.findById(req.params.jobId);
  
  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.jobId}`, 404)
    );
  }

  // Make sure user is job recruiter or from same company
  if (
    job.recruiter.toString() !== req.user.id &&
    req.user.role !== 'company_admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this job's candidates`,
        401
      )
    );
  }

  // Get all candidates
  let candidates = await User.find({
    role: 'candidate',
    isVerified: true
  })
    .limit(100)
    .lean();

  // Get candidate experiences and skills
  const candidateIds = candidates.map(candidate => candidate._id);
  const experiences = await Experience.find({
    user: { $in: candidateIds }
  });
  const skills = await Skill.find({
    user: { $in: candidateIds }
  });

  // Group experiences and skills by user
  const experiencesByUser = experiences.reduce((acc, exp) => {
    const userId = exp.user.toString();
    if (!acc[userId]) acc[userId] = [];
    acc[userId].push(exp);
    return acc;
  }, {});
  
  const skillsByUser = skills.reduce((acc, skill) => {
    const userId = skill.user.toString();
    if (!acc[userId]) acc[userId] = [];
    acc[userId].push(skill);
    return acc;
  }, {});

  // Calculate match score for each candidate
  const matchedCandidates = await Promise.all(
    candidates.map(async candidate => {
      const candidateExp = experiencesByUser[candidate._id.toString()] || [];
      const candidateSkills = skillsByUser[candidate._id.toString()] || [];
      
      const matchScore = await calculateMatchScore(
        candidate,
        job,
        candidateExp,
        candidateSkills,
        true // isRecruiterSearching
      );
      
      return {
        ...candidate,
        matchScore
      };
    })
  );

  // Sort by match score descending
  matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);

  // Apply premium boost if applicable
  const boostedCandidates = matchedCandidates.sort((a, b) => {
    // First by boost status
    if (a.boostActive && !b.boostActive) return -1;
    if (!a.boostActive && b.boostActive) return 1;
    
    // Then by premium status
    if (a.isPremium && !b.isPremium) return -1;
    if (!a.isPremium && b.isPremium) return 1;
    
    // Then by match score
    return b.matchScore - a.matchScore;
  });

  res.status(200).json({
    success: true,
    count: boostedCandidates.length,
    data: boostedCandidates
  });
});

// @desc    Record swipe action
// @route   POST /api/matches/swipe
// @access  Private
exports.recordSwipe = asyncHandler(async (req, res, next) => {
  const { jobId, action, reason } = req.body;

  if (!jobId || !action) {
    return next(new ErrorResponse('Please provide jobId and action', 400));
  }

  if (!['left', 'right', 'favorite'].includes(action)) {
    return next(
      new ErrorResponse(
        'Action must be one of: left, right, favorite',
        400
      )
    );
  }

  // Ensure job exists
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new ErrorResponse(`Job not found with id of ${jobId}`, 404));
  }

  // Check for existing swipe history
  const existingSwipe = await SwipeHistory.findOne({
    user: req.user.id,
    job: jobId
  });

  if (existingSwipe) {
    // Update existing swipe record
    existingSwipe.action = action;
    existingSwipe.reason = reason || null;
    existingSwipe.date = Date.now();
    
    await existingSwipe.save();
    
    // If action was changed from left to right, create application
    if (existingSwipe.action === 'right' && action === 'right') {
      await createApplication(req.user.id, jobId);
    }
  } else {
    // Create new swipe record
    await SwipeHistory.create({
      user: req.user.id,
      job: jobId,
      action,
      reason: reason || null
    });
    
    // If swiped right, create application
    if (action === 'right') {
      await createApplication(req.user.id, jobId);
    }
    
    // If action is favorite, increment job likes count
    if (action === 'favorite') {
      job.likes += 1;
      await job.save();
    }
  }

  res.status(200).json({
    success: true,
    data: { action }
  });
});

// Helper function to create application
const createApplication = async (userId, jobId) => {
  // Check if application already exists
  const existingApplication = await Application.findOne({
    candidate: userId,
    job: jobId
  });

  if (!existingApplication) {
    // Create new application
    const application = await Application.create({
      candidate: userId,
      job: jobId
    });

    // Increment job application count
    const job = await Job.findById(jobId);
    await job.incrementApplicationCount();

    return application;
  }

  return existingApplication;
};