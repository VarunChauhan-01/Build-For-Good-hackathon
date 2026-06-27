const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

// ── Specific routes FIRST (before /:id wildcard) ──────────────────
router.get('/suggested', optionalAuth, jobController.getSuggestedJobs);
router.get('/applications', authMiddleware, jobController.getApplications);
router.get('/employer/jobs', authMiddleware, jobController.getEmployerJobs);
router.get('/employer/applicants', authMiddleware, jobController.getEmployerApplicants);
router.put('/applications/:id/status', authMiddleware, jobController.updateApplicationStatus);
router.delete('/applications/:id', authMiddleware, jobController.withdrawApplication);

// ── Generic CRUD ──────────────────────────────────────────────────
router.get('/', jobController.getJobs);
router.post('/', authMiddleware, jobController.createJob);
router.get('/:id', jobController.getJobById);
router.put('/:id', authMiddleware, jobController.updateJob);
router.delete('/:id', authMiddleware, jobController.deleteJob);
router.post('/:id/apply', authMiddleware, jobController.applyToJob);
router.put('/:id/complete', authMiddleware, jobController.markJobCompleted);

module.exports = router;
