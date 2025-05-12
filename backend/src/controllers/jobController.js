const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/asyncHandler');
const { optimizeJobDescription } = require('../services/aiService');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id)
    .populate({
      path: 'company',
      select: 'name logo description'
    })
    .populate({
      path: 'recruiter',
      select: 'firstName lastName'
    });

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment view count
  await job.incrementViewCount();

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Recruiter/Company Admin)
exports.createJob = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.recruiter = req.user.id;
  
  // Check for user's company
  const user = await User.findById(req.user.id);
  if (!user.company) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} is not associated with any company`,
        400
      )
    );
  }
  
  req.body.company = user.company;

  // Create job
  const job = await Job.create(req.body);

  res.status(201).json({
    success: true,
    data: job
  });
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Company Admin)
exports.updateJob = asyncHandler(async (req, res, next) => {
  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is job recruiter or company admin
  if (
    job.recruiter.toString() !== req.user.id &&
    req.user.role !== 'company_admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this job`,
        401
      )
    );
  }

  job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Company Admin)
exports.deleteJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is job recruiter or company admin
  if (
    job.recruiter.toString() !== req.user.id &&
    req.user.role !== 'company_admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this job`,
        401
      )
    );
  }

  // Check if job has applications
  const applications = await Application.countDocuments({ job: req.params.id });
  
  if (applications > 0) {
    // Just mark as closed instead of deleting
    job.status = 'closed';
    await job.save();
  } else {
    await job.remove();
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Close job
// @route   PUT /api/jobs/:id/close
// @access  Private (Recruiter/Company Admin)
exports.closeJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is job recruiter or company admin
  if (
    job.recruiter.toString() !== req.user.id &&
    req.user.role !== 'company_admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to close this job`,
        401
      )
    );
  }

  job.status = 'closed';
  await job.save();

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Optimize job description with AI
// @route   POST /api/jobs/:id/optimize
// @access  Private (Recruiter/Company Admin)
exports.optimizeJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(
      new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is job recruiter or company admin
  if (
    job.recruiter.toString() !== req.user.id &&
    req.user.role !== 'company_admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to optimize this job`,
        401
      )
    );
  }

  try {
    // Use AI service to optimize job description
    const optimizedDescription = await optimizeJobDescription(
      job.title,
      job.description,
      req.body.style || 'professional'
    );

    // Update job with optimized description
    job.description = optimizedDescription;
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    return next(
      new ErrorResponse('Failed to optimize job description', 500)
    );
  }
});