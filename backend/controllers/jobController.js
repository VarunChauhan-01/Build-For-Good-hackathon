/**
 * Job Controller (Mongoose Version) — Phase 2
 * Full CRUD, search/sort/paginate, suggested jobs, employer dashboard, withdrawal, notifications.
 */
const { Job, Application, User } = require('../models');
const { createNotification } = require('../utils/notificationHelper');

const jobController = {
  // ─── GET /jobs — Search, Filter, Sort, Paginate ─────────────────
  getJobs: async (req, res, next) => {
    try {
      const { category, search, verified, sort, page, limit, status } = req.query;

      const filter = {};

      if (category && category !== 'All') {
        filter.category = category;
      }
      if (verified === 'true') {
        filter.verified = 1;
      }
      if (status) {
        filter.status = status;
      } else {
        filter.status = 'Active'; // default: only active jobs
      }
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        filter.$or = [
          { title: searchRegex },
          { employer: searchRegex },
          { category: searchRegex },
          { location: searchRegex }
        ];
      }

      // Sort options
      let sortOption = { createdAt: -1 };
      if (sort === 'pay_high') sortOption = { pay: -1 };
      else if (sort === 'pay_low') sortOption = { pay: 1 };
      else if (sort === 'trust') sortOption = { trust_score: -1 };
      else if (sort === 'oldest') sortOption = { createdAt: 1 };

      // Pagination
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 20));
      const skip = (pageNum - 1) * limitNum;

      const [jobs, totalCount] = await Promise.all([
        Job.find(filter).sort(sortOption).skip(skip).limit(limitNum),
        Job.countDocuments(filter)
      ]);

      const normalizedJobs = jobs.map(job => {
        const j = job.toObject();
        j.id = String(j._id);
        return j;
      });

      res.json({
        jobs: normalizedJobs,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // ─── GET /jobs/suggested — Personalized job recommendations ─────
  getSuggestedJobs: async (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : null;
      let suggestedJobs = [];

      if (userId) {
        const user = await User.findById(userId);
        const filter = { status: 'Active' };

        // Build $or conditions based on user profile
        const orConditions = [];
        if (user && user.skills && user.skills.length > 0) {
          orConditions.push({ category: { $in: user.skills } });
          orConditions.push({ title: { $in: user.skills.map(s => new RegExp(s, 'i')) } });
        }
        if (user && user.location) {
          orConditions.push({ location: new RegExp(user.location, 'i') });
        }
        if (user && user.profession) {
          orConditions.push({ category: new RegExp(user.profession, 'i') });
        }

        if (orConditions.length > 0) {
          filter.$or = orConditions;
        }

        // Exclude jobs user already applied to
        const existingApps = await Application.find({ user_id: userId });
        const appliedJobIds = existingApps.map(a => a.job_id);
        if (appliedJobIds.length > 0) {
          filter._id = { $nin: appliedJobIds };
        }

        suggestedJobs = await Job.find(filter).sort({ trust_score: -1, createdAt: -1 }).limit(5);
      }

      // Fallback: return latest active jobs if no personalized results
      if (suggestedJobs.length === 0) {
        suggestedJobs = await Job.find({ status: 'Active' }).sort({ createdAt: -1 }).limit(5);
      }

      const normalized = suggestedJobs.map(j => {
        const obj = j.toObject();
        obj.id = String(obj._id);
        return obj;
      });

      res.json({ jobs: normalized });
    } catch (error) {
      next(error);
    }
  },

  getJobById: async (req, res, next) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      const jobObj = job.toObject();
      jobObj.id = String(jobObj._id);

      res.json({ job: jobObj });
    } catch (error) {
      next(error);
    }
  },

  createJob: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
      const { title, employer, pay, location, category, description, total_slots } = req.body;
      if (!title || !category) {
        return res.status(400).json({ error: 'Title and category are required' });
      }

      const poster = await User.findById(req.user.id);

      const newJob = await Job.create({
        title,
        employer: employer || (poster ? poster.name : 'Verified Employer'),
        trust_score: poster ? poster.trust_score : 90,
        pay: pay || '₹500/day',
        distance: '2.0 km',
        location: location || (poster ? poster.location : 'Local Area'),
        category,
        verified: poster ? poster.is_verified : 1,
        description: description || '',
        postedBy: req.user.id,
        status: 'Active',
        total_slots: total_slots || 1,
        filled_slots: 0
      });

      const jobObj = newJob.toObject();
      jobObj.id = String(jobObj._id);

      res.status(201).json({ message: 'Job created successfully', job: jobObj });
    } catch (error) {
      next(error);
    }
  },

  updateJob: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      // Only the job poster or admin can update
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      if (String(job.postedBy) !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You can only edit your own jobs' });
      }

      const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

      const jobObj = updated.toObject();
      jobObj.id = String(jobObj._id);

      res.json({ message: 'Job updated successfully', job: jobObj });
    } catch (error) {
      next(error);
    }
  },

  deleteJob: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      if (String(job.postedBy) !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'You can only delete your own jobs' });
      }

      await Job.findByIdAndDelete(req.params.id);
      // Also remove related applications
      await Application.deleteMany({ job_id: req.params.id });

      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      next(error);
    }
  },

  // ─── POST /jobs/:id/apply — Apply to a job ─────────────────────
  applyToJob: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const { method, voice_transcript } = req.body;
      const jobId = req.params.id;

      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      if (job.status !== 'Active') return res.status(400).json({ error: 'This job is no longer active' });

      // Prevent duplicate applications
      const existing = await Application.findOne({ job_id: String(jobId), user_id: String(req.user.id), status: { $ne: 'Withdrawn' } });
      if (existing) return res.status(400).json({ error: 'Already applied to this job' });

      const application = await Application.create({
        job_id: String(jobId),
        user_id: String(req.user.id),
        method: method || 'manual',
        voice_transcript: voice_transcript || null,
        status: 'Applied'
      });

      // Notify employer
      if (job.postedBy) {
        const applicant = await User.findById(req.user.id);
        const applicantName = applicant ? applicant.name : 'A worker';
        await createNotification(
          String(job.postedBy),
          'New Job Application',
          `${applicantName} applied to your job "${job.title}".`,
          'application'
        );
      }

      const appObj = application.toObject();
      appObj.id = String(appObj._id);

      res.status(201).json({ message: 'Application submitted successfully', application: appObj });
    } catch (error) {
      next(error);
    }
  },

  // ─── PUT /jobs/applications/:id/status — Accept/Reject/Complete ─
  updateApplicationStatus: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }
      const { status } = req.body;
      const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected', 'Completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Valid: ${validStatuses.join(', ')}` });
      }

      const application = await Application.findById(req.params.id);
      if (!application) return res.status(404).json({ error: 'Application not found' });

      application.status = status;
      await application.save();

      // Notify the worker about status change
      const job = await Job.findById(application.job_id);
      const jobTitle = job ? job.title : 'a job';

      if (status === 'Accepted') {
        await createNotification(
          application.user_id,
          'Application Accepted! 🎉',
          `Your application for "${jobTitle}" has been accepted.`,
          'application'
        );
        // Increment filled_slots
        if (job) {
          job.filled_slots = (job.filled_slots || 0) + 1;
          await job.save();
        }
      } else if (status === 'Rejected') {
        await createNotification(
          application.user_id,
          'Application Update',
          `Your application for "${jobTitle}" was not selected.`,
          'application'
        );
      } else if (status === 'Completed') {
        await createNotification(
          application.user_id,
          'Job Completed ✅',
          `The job "${jobTitle}" has been marked as completed.`,
          'job'
        );
        // Update user's completed_jobs counter
        await User.findByIdAndUpdate(application.user_id, { $inc: { completed_jobs: 1 } });
      }

      const appObj = application.toObject();
      appObj.id = String(appObj._id);

      res.json({ message: 'Application status updated', application: appObj });
    } catch (error) {
      next(error);
    }
  },

  // ─── GET /jobs/applications — My applications ───────────────────
  getApplications: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const apps = await Application.find({ user_id: String(req.user.id) }).sort({ createdAt: -1 });

      // Enrich with job details
      const enrichedApps = await Promise.all(apps.map(async (app) => {
        const a = app.toObject();
        a.id = String(a._id);
        const job = await Job.findById(a.job_id);
        if (job) {
          a.jobTitle = job.title;
          a.jobEmployer = job.employer;
          a.jobPay = job.pay;
          a.jobLocation = job.location;
        }
        return a;
      }));

      res.json({ applications: enrichedApps });
    } catch (error) {
      next(error);
    }
  },

  // ─── DELETE /jobs/applications/:id — Withdraw application ───────
  withdrawApplication: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const app = await Application.findById(req.params.id);
      if (!app) return res.status(404).json({ error: 'Application not found' });
      if (app.user_id !== String(req.user.id)) {
        return res.status(403).json({ error: 'You can only withdraw your own applications' });
      }
      if (app.status === 'Accepted' || app.status === 'Completed') {
        return res.status(400).json({ error: 'Cannot withdraw an accepted or completed application' });
      }

      app.status = 'Withdrawn';
      await app.save();

      res.json({ message: 'Application withdrawn successfully' });
    } catch (error) {
      next(error);
    }
  },

  // ─── GET /jobs/employer/jobs — Employer's posted jobs ───────────
  getEmployerJobs: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });

      const normalizedJobs = jobs.map(job => {
        const j = job.toObject();
        j.id = String(j._id);
        return j;
      });

      res.json({ jobs: normalizedJobs });
    } catch (error) {
      next(error);
    }
  },

  // ─── GET /jobs/employer/applicants — Applicants for employer jobs
  getEmployerApplicants: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      // Get all jobs posted by this employer
      const employerJobs = await Job.find({ postedBy: req.user.id });
      const jobIds = employerJobs.map(j => String(j._id));

      if (jobIds.length === 0) {
        return res.json({ applicants: [] });
      }

      // Get all applications for these jobs
      const apps = await Application.find({ job_id: { $in: jobIds } }).sort({ createdAt: -1 });

      // Enrich with user and job info
      const enriched = await Promise.all(apps.map(async (app) => {
        const a = app.toObject();
        a.id = String(a._id);
        const user = await User.findById(a.user_id);
        const job = await Job.findById(a.job_id);
        if (user) {
          a.applicantName = user.name;
          a.applicantPhone = user.phone;
          a.applicantTrustScore = user.trust_score;
          a.applicantVerified = user.is_verified;
        }
        if (job) {
          a.jobTitle = job.title;
        }
        return a;
      }));

      res.json({ applicants: enriched });
    } catch (error) {
      next(error);
    }
  },

  // ─── PUT /jobs/:id/complete — Mark job as completed ─────────────
  markJobCompleted: async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });

      if (String(job.postedBy) !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Only the job poster can mark it complete' });
      }

      job.status = 'Completed';
      await job.save();

      // Mark all accepted applications as completed and notify workers
      const acceptedApps = await Application.find({ job_id: String(job._id), status: 'Accepted' });
      for (const app of acceptedApps) {
        app.status = 'Completed';
        await app.save();
        await User.findByIdAndUpdate(app.user_id, { $inc: { completed_jobs: 1 } });
        await createNotification(
          app.user_id,
          'Job Completed ✅',
          `The job "${job.title}" has been marked as completed. Great work!`,
          'job'
        );
      }

      res.json({ message: 'Job marked as completed', completedApplications: acceptedApps.length });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = jobController;
